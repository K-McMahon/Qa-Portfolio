import { createSyntheticIdentity } from './synthetic-identity';

export type RegistrationData = {
  title: 'Mr' | 'Mrs';
  name: string;
  email: string;
  password: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
  newsletter: boolean;
  partnerOffers: boolean;
};

export function createRegistrationData(): RegistrationData {
  const { email, uniqueId } = createSyntheticIdentity('registration');

  return {
    title: 'Mr',
    name: `QA Registration ${uniqueId}`,
    email,
    password: 'QaPortfolioRegistration!42',
    birthDay: '15',
    birthMonth: '8',
    birthYear: '1990',
    firstName: 'QA',
    lastName: 'Registration',
    company: 'The McMahon Standard QA',
    address1: '100 Quality Lane',
    address2: 'Suite 121',
    country: 'United States',
    state: 'Pennsylvania',
    city: 'Philadelphia',
    zipcode: '19103',
    mobileNumber: '2155550121',
    newsletter: true,
    partnerOffers: true,
  };
}
