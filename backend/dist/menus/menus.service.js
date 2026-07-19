"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenusService = void 0;
const common_1 = require("@nestjs/common");
const menus_interface_1 = require("./menus.interface");
let MenusService = class MenusService {
    menus = menus_interface_1.MOCK_MENUS;
    findAll() {
        return this.menus.filter((menu) => menu.isActive);
    }
    findOne(id) {
        return this.menus.find((menu) => menu.id === id);
    }
    findBySlug(slug) {
        return this.menus.find((menu) => menu.slug === slug);
    }
};
exports.MenusService = MenusService;
exports.MenusService = MenusService = __decorate([
    (0, common_1.Injectable)()
], MenusService);
//# sourceMappingURL=menus.service.js.map