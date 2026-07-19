import { Repository } from 'typeorm';
import { Menu } from './menu.entity';
export declare class MenusService {
    private menusRepository;
    constructor(menusRepository: Repository<Menu>);
    findAll(): Promise<Menu[]>;
    findOne(id: string): Promise<Menu | null>;
    findBySlug(slug: string): Promise<Menu | null>;
    seedMenus(): Promise<string>;
}
