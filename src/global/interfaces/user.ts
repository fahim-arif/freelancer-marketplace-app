import { VettingStatus } from 'global/enums/vettingStatus';
import { UserOrderingGroup } from 'global/enums/userOrderingGroup';
import { IPagingFilter } from './ordering';
import { ISkill } from './skill';
import { IFileMetadata } from './file';
import { Language } from 'global/enums/language';
import { LanguageProficiency } from 'global/enums/languageProficiency';

export interface IScreeningLinks {
  behance?: string | null;
  personalSite?: string | null;
  github?: string | null;
  linkedIn?: string | null;
  instagram?: string | null;
  stackOverflow?: string | null;
  twitter?: string | null;
  dribbble?: string | null;
  tikTok?: string | null;
  other?: string | null;
}

export interface IUploadQueue {
  isUploadCancelled: boolean;
  tempId: string;
  file: File;
}

export interface IWorkHistory {
  company: string;
  title: string;
  fromMonth: number;
  fromYear: number;
  toMonth: number | null;
  toYear: number | null;
  isPresentPosition: boolean;
}

export interface IFixedPackage {
  price?: number | null;
  deliverables: string[];
  deliveryMethods?: number | null;
  revisions?: number | null;
  license?: string;
  custom?: string;
}

export interface IFixedPackageError {
  price?: boolean;
  deliverables: boolean[];
  revisions?: boolean;
  deliveryMethods?: boolean;
  license?: boolean;
  custom?: boolean;
}

export interface IVetting {
  status: VettingStatus;
  submittedOn?: string | null;
  viewedOn?: string | null;
}

export interface IVettingChange {
  comment?: string;
  status: VettingStatus;
}

export interface IVettingChangeView extends IVettingChange {
  createdAt: string;
  createdBy: string;
}

export interface ILanguageSkill {
  language: Language;
  proficiency: LanguageProficiency;
}

export interface IPortfolioFile extends IFileMetadata {
  isFeatured: boolean;
}

export interface IFrontUser extends IFrontUserBase {
  mainCategory: string;
  secondCategory: string;
  workHistories: IWorkHistory[];
  fixedPackages: IFixedPackage[];
  connectionCount: number;
}

export interface IFrontUserBase {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  hourlyRate?: number;
  country: string;
  skills: ISkill[];
  languages: ILanguageSkill[];
  packagesFrom: string;
  portfolioFiles: IPortfolioFile[];
  isNew: boolean;
}

export interface IBaseUserFilters extends IPagingFilter {
  category?: string;
  search?: string;
  maxHourlyRate?: number;
  maxDeliveryMethod?: number;
}

export interface IFrontUserFilters extends IBaseUserFilters {
  orderingGroup?: UserOrderingGroup;
  onlySellingServices?: boolean;
}

export interface IUserFilters extends IBaseUserFilters {
  vettingStatus?: VettingStatus;
  ordering?: string;
  isSellingServices?: boolean;
}

export interface IVettingViewMessage {
  userId: string;
  viewedOn: string;
}

export interface IEditableUser {
  isSellingServices: boolean;
  profileImage?: IFileMetadata | null;
  email: string;
  firstName: string;
  lastName: string;
  title?: string | null;
  city?: string;
  country: string;
  countryEditable: boolean;
  languages: ILanguageSkill[];
  skills: ISkill[];
  bio?: string | null;
  mainCategory?: string | null;
  secondCategory?: string | null;

  portfolioFiles: IPortfolioFile[];
  workHistories: IWorkHistory[];

  vetting: IVetting;
  links: IScreeningLinks;
  hourlyRate?: number | null;
  fixedPackages: IFixedPackage[];

  isUploading: boolean;
  isScreenLinkError?: boolean;
  isSubmittingForVetting?: boolean;
}

export interface IUser extends IEditableUser {
  id: string;
  connectionCount: number;
}
