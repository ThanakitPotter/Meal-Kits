import { Injectable } from '@nestjs/common';
import type { Menu } from './menus.interface';
import { MOCK_MENUS } from './menus.interface';

@Injectable()
export class MenusService {
  private readonly menus: Menu[] = MOCK_MENUS;

  findAll(): Menu[] {
    return this.menus.filter((menu) => menu.isActive);
  }

  findOne(id: string): Menu | undefined {
    return this.menus.find((menu) => menu.id === id);
  }

  findBySlug(slug: string): Menu | undefined {
    return this.menus.find((menu) => menu.slug === slug);
  }
}
