import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

export const authGuardFn: CanActivateFn = () => {
    const authService = inject(AuthService);
    const routerService = inject(Router);

    const username: String | undefined = authService.extractUsername();
    const role: String | undefined = authService.extractRole();

    if (username == undefined || role == undefined) {
        routerService.navigate(['/login']);
        return false;
    }

    return true;
}