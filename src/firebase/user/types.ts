export interface UserProfile{
    name: string;
    email: string;
    phone?: string;
    address?:{
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
    };
  
    
}