import { inject, Inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SharedService } from '../services/shared.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const userService = inject(UserService);
  const sharedService = inject(SharedService);
  const router = inject(Router);

  await new Promise(resolve => setTimeout(resolve, 0));
  sharedService.siteIsLoading(false);
  const token = userService.getToken()
  if (token == null) {
    sharedService.setSiteviewer(false);
    sharedService.setisDisableAnimation(false);
    sharedService.siteIsLoading(true);
    return router.navigate(['/login']);
  }
  const apiURL = 'https://join-backend-p0l1.onrender.com/api/users/auth-check/'

  const response = await fetch(`${apiURL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    },
  })
  if (response.ok) {
    const user = await response.json();
    userService.setIsLoggedIn(user);
    return true;
  } else {
    sharedService.setSiteviewer(false);
    sharedService.setisDisableAnimation(false);
    sharedService.siteIsLoading(true);
    return router.navigate(['/login']);
  }
};
