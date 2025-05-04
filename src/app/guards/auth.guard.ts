import { inject, Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SharedService } from '../services/shared.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const sharedService = inject(SharedService);
  const router = inject(Router);

  await new Promise(resolve => setTimeout(resolve, 10));

  const token = userService.getToken()
  if (token == null) {
    sharedService.setisDisableAnimation(true);
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
    userService.setIsLoggedIn(true);
    return true;
  } else {
    sharedService.setisDisableAnimation(true);
    return router.navigate(['/login']);
  }
};
