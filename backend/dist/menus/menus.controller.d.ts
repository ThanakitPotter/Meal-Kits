import { MenusService } from './menus.service';
export declare class MenusController {
    private readonly menusService;
    constructor(menusService: MenusService);
    findAll(): Promise<import("./menu.entity").Menu[]>;
    seed(): Promise<string>;
    findOne(id: string): Promise<import("./menu.entity").Menu | null>;
}
