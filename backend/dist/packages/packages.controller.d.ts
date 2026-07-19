import { PackagesService } from './packages.service';
export declare class PackagesController {
    private readonly packagesService;
    constructor(packagesService: PackagesService);
    findAll(): import("./packages.interface").Package[];
    findOne(id: string): import("./packages.interface").Package | undefined;
}
