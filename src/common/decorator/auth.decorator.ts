
import {applyDecorators, SetMetadata, UseGuards} from '@nestjs/common';
import {RolesGuard} from "../guards/roles-guard.service";
import {ApiBearerAuth, ApiUnauthorizedResponse} from "@nestjs/swagger";
interface Role {
}

export function Auth(...roles: Role[]) {
    return applyDecorators(
        SetMetadata('role', roles),
        UseGuards(RolesGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}
