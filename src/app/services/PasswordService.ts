import * as bcrypt from 'bcryptjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  // Generate a hash (like Spring's BCryptPasswordEncoder)
  encodePassword(password: string): string {
    const salt = bcrypt.genSaltSync(10); // same cost factor as backend
    return bcrypt.hashSync(password, salt);
  }

  // Compare raw password with hash (like passwordEncoder.matches in Spring)
  matches(rawPassword: string, hash: string): boolean {
    return bcrypt.compareSync(rawPassword, hash);
  }
}
