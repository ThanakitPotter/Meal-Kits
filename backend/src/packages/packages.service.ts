import { Injectable } from '@nestjs/common';
import type { Package } from './packages.interface';
import { MOCK_PACKAGES } from './packages.interface';

@Injectable()
export class PackagesService {
  private readonly packages: Package[] = MOCK_PACKAGES;

  findAll(): Package[] {
    return this.packages.filter((pkg) => pkg.isActive);
  }

  findOne(id: string): Package | undefined {
    return this.packages.find((pkg) => pkg.id === id);
  }

  findBySlug(slug: string): Package | undefined {
    return this.packages.find((pkg) => pkg.slug === slug);
  }
}
