import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {UserService} from "../service/user.service";
import {User, UserRole} from "../models/user.interface";
import {catchError, map, Observable, of} from "rxjs";
import {hasRoles} from "../../auth/decorator/roles.decorator";
import {JwtAuthGuard} from "../../auth/guards/jwt-guard";
import {RolesGuard} from "../../auth/guards/roles.guard";
import {Pagination} from "nestjs-typeorm-paginate";

@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }

    @Post()
    create(@Body()user: User): Observable<User | Object> {
        return this.userService.create(user).pipe(
            map((user: User) => user),
            catchError(err => of({error: err.message}))
        );
    }

    @Post('login')
    login(@Body() user: User): Observable<Object> {
        return this.userService.login(user).pipe(
            map((jwt: string) => {
                return { access_token: jwt };
            })
        )
    }

    @Get(':id')
    findOne(@Param()params): Observable<User> {
        return this.userService.findOne(params.id);
    }

    @hasRoles(UserRole.ADMIN)
    // @UseGuards(JwtAuthGuard, RolesGuard)
    @Get()
    index(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Observable<Pagination<User>> {
        limit = limit > 100 ? 100 : limit;

        return this.userService.paginate({page: Number(page), limit: Number(limit), route: 'http://localhost:3000/api/users'});
    }

    @Delete(':id')
    deleteOne(@Param('id')id: string): Observable<User> {
        return this.userService.deleteOne(Number(id));
    }

    @Put(':id')
    updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
        return this.userService.updateOne(Number(id), user);
    }

    @Put(':id/role')
    updateRoleOfUser(@Param('id') id: string, @Body() user: User): Observable<User> {
        return this.userService.updateRoleOfUser(Number(id), user);
    }
}
