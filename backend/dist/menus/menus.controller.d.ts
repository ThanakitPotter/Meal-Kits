import { MenusService } from './menus.service';
export declare class MenusController {
    private readonly menusService;
    constructor(menusService: MenusService);
    findAll(): import("./menus.interface").Menu[];
    findOne(id: string): import("./menus.interface").Menu | undefined;
}
