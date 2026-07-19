import type { Package } from './packages.interface';
export declare class PackagesService {
    private readonly packages;
    findAll(): Package[];
    findOne(id: string): Package | undefined;
    findBySlug(slug: string): Package | undefined;
}
