import { inject, Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  await new Promise(resolve => setTimeout(resolve, 10));

  const token = userService.getToken()
  if (token == null) {
    return router.navigate(['/login']);
  }
  const apiURL = 'http://127.0.0.1:8000/api/users/auth-check/'

  const response = await fetch(`${apiURL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
  })
  if (response.ok) {
    return true;
  } else {
    return router.navigate(['/login']);
  }
};
