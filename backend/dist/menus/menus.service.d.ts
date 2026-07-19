import type { Menu } from './menus.interface';
export declare class MenusService {
    private readonly menus;
    findAll(): Menu[];
    findOne(id: string): Menu | undefined;
    findBySlug(slug: string): Menu | undefined;
}
