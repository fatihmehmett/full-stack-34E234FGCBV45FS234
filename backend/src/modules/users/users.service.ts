import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';
import { UserDataDto } from './users.models';
import { ErrorStatus, SuccessStatus } from 'src/utils/response.util';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllUsers({ page, pageSize, search }) {
    try {
      const offset = (page - 1) * pageSize;
      let query = 'SELECT id, name, surname, email, phone, age, country, district, role, created_at, updated_at FROM users';
      const params = [];

      if (search) {
        query += ` WHERE name ILIKE $1 OR surname ILIKE $1`;
        params.push(`%${search}%`);
      }

      query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(pageSize, offset);

      const result = await this.databaseService.query(query, params);

      return SuccessStatus(
        {
          users: result.rows,
          totalUserCount: await this.getTotalUsersCount(search),
          page,
          pageSize,
        },
        'Users fetched successfully',
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      return ErrorStatus('Error fetching users', 500, error.message);
    }
  }

  // Tootal user count
  private async getTotalUsersCount(search: string) {
    try {
      let query = 'SELECT COUNT(*) FROM users';
      const params = [];

      if (search) {
        query += ' WHERE name ILIKE $1 OR surname ILIKE $1';
        params.push(`%${search}%`);
      }

      const result = await this.databaseService.query(query, params);
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      console.error('Error fetching total user count:', error);
      return ErrorStatus('Error fetching user', 500, error.message);
    }
  }

  async getUserById(id: number) {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM users WHERE id = $1',
        [id],
      );
      if (result.rowCount > 0) {
        return SuccessStatus(result.rows[0], 'User fetched successfully');
      } else {
        return ErrorStatus('User not found', 404);
      }
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return ErrorStatus('Error fetching user', 500, error.message);
    }
  }

  async saveUser(createUserDto: UserDataDto) {
    const {
      name,
      surname,
      email,
      password,
      phone,
      age,
      country,
      district,
      role,
    } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const result = await this.databaseService.query(
        `INSERT INTO users (
                name, surname, email, password, phone, age, country, district, role, created_at, updated_at
              ) 
              VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
              RETURNING *`,
        [
          name,
          surname,
          email,
          hashedPassword,
          phone,
          age,
          country,
          district,
          role,
        ],
      );
      return SuccessStatus(null, 'User saved successfully');
    } catch (error) {
      console.error('Error saving user:', error);
      return ErrorStatus('Error saving user', 500, error.message);
    }
  }

  // Kullanıcıyı güncelle
  async updateUser(updateUserDto: UserDataDto) {
    try {
      const {
        id,
        name,
        surname,
        email,
        password,
        phone,
        age,
        country,
        district,
        role,
      } = updateUserDto;

      const updateFields = [];
      const values = [];

      const addUpdateField = async (fieldName: string, fieldValue: any) => {
        if (fieldValue) {
          let value = fieldValue;
          if (fieldName === 'password') {
            value = await bcrypt.hash(fieldValue, 10);
          }
          updateFields.push(`${fieldName} = $${values.length + 1}`);
          values.push(value);
        }
      };

      await addUpdateField('name', name);
      await addUpdateField('surname', surname);
      await addUpdateField('email', email);
      await addUpdateField('password', password);
      await addUpdateField('phone', phone);
      await addUpdateField('age', age);
      await addUpdateField('country', country);
      await addUpdateField('district', district);
      await addUpdateField('role', role);
      updateFields.push('updated_at = NOW()'); // güncelleme zamanını ekle
      values.push(id);

      const result = await this.databaseService.query(
        `UPDATE users 
        SET ${updateFields.join(', ')} 
        WHERE id = $${values.length} 
        RETURNING *;
      `,
        values,
      );

      if (result.rowCount > 0) {
        return SuccessStatus(null, 'User updated successfully');
      } else {
        return ErrorStatus('User not found', 404);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      return ErrorStatus('Internal Server Error', 500, error.message);
    }
  }

  async deleteUser(id: number) {
    try {
      const result = await this.databaseService.query(
        'DELETE FROM users WHERE id = $1',
        [id],
      );

      if (result.rowCount > 0) {
        return SuccessStatus(null, 'User deleted successfully');
      } else {
        return ErrorStatus('User not found', 404);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      return ErrorStatus('Internal Server Error', 500, error.message);
    }
  }
}
