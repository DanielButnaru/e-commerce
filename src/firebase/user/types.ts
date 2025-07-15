export interface UserProfile{
    name: string;
    email: string;
    phone?: string;
    adress?:{
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
    };
  
    
}