export class CreatePackageDto {
  name!: string;
  slug!: string;
  description!: string;
  price!: number;
  image!: string;
  items!: string[];
  category!: '5K' | 'HalfMarathon' | 'Recovery';
  isActive!: boolean;
}
