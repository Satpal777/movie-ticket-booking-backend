import z from 'zod';
import { AnyZodObject } from 'zod/v3';

class BaseDto {
    static schema = z.object({})

    static validate(data: AnyZodObject) {
       const result =  this.schema.safeParse(data);

        if(result.error){
            const errors = result.error.issues.map(issue => `${issue.path.join('.')} - ${issue.message}`).join(', ');
            return {errors, value: null};
        }
        
        return {errors: null, value: result.data};
    }

}

export default BaseDto;