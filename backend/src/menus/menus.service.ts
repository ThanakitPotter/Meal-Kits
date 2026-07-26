import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './menu.entity';
import { MOCK_MENUS } from './menus.interface';

@Injectable()
export class MenusService implements OnModuleInit {
  constructor(
    @InjectRepository(Menu)
    private menusRepository: Repository<Menu>,
  ) {}

  async onModuleInit() {
    const testMenu = await this.menusRepository.findOne({ where: { slug: 'test-menu-1-baht' } });
    if (!testMenu) {
      await this.seedMenus();
    }
  }

  findAll(): Promise<Menu[]> {
    return this.menusRepository.find({ where: { isActive: true } });
  }

  findOne(id: string): Promise<Menu | null> {
    return this.menusRepository.findOne({ where: { id } });
  }

  findBySlug(slug: string): Promise<Menu | null> {
    return this.menusRepository.findOne({ where: { slug } });
  }

  async seedMenus(): Promise<string> {
    const existing = await this.menusRepository.find();
    if (existing.length > 0) {
      await this.menusRepository.remove(existing);
    }
    for (const menuData of MOCK_MENUS) {
      // Exclude the mock string ID to let postgres generate a UUID
      const { id, ...data } = menuData;
      const newMenu = this.menusRepository.create(data);
      await this.menusRepository.save(newMenu);
    }
    return `Seeded ${MOCK_MENUS.length} menus successfully!`;
  }
}
