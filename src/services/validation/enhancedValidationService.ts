
import { z } from 'zod';
import { validationSchemas } from './zodSchemas';
import { useToast } from '@/hooks/use-toast';

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationRule {
  field: string;
  validator: z.ZodSchema;
  message?: string;
}

export const useValidationService = () => {
  const { toast } = useToast();

  const validateWithSchema = <T>(
    schema: z.ZodSchema<T>, 
    data: unknown,
    showToast: boolean = true
  ): ValidationResult<T> => {
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationError[] = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        if (showToast) {
          const firstError = errors[0];
          toast({
            title: "Validation Error",
            description: `${firstError.field}: ${firstError.message}`,
            variant: "destructive"
          });
        }

        return { success: false, errors };
      }
      
      const genericError: ValidationError = {
        field: 'unknown',
        message: 'Validation failed',
        code: 'invalid_input'
      };

      return { success: false, errors: [genericError] };
    }
  };

  const createCustomValidator = (rules: ValidationRule[]) => {
    const schemaFields: Record<string, z.ZodSchema> = {};
    
    rules.forEach(rule => {
      schemaFields[rule.field] = rule.validator;
    });

    return z.object(schemaFields);
  };

  const validateFormData = <T>(formData: FormData, schema: z.ZodSchema<T>): ValidationResult<T> => {
    const data: Record<string, any> = {};
    
    formData.forEach((value, key) => {
      if (data[key]) {
        // Handle multiple values for the same key
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    });

    return validateWithSchema(schema, data);
  };

  const validateStep = (
    data: unknown,
    step: keyof typeof validationSchemas
  ): ValidationResult<any> => {
    const schema = validationSchemas[step];
    if (!schema) {
      throw new Error(`No validation schema found for step: ${step}`);
    }
    
    try {
      const validatedData = schema.parse(data);
      return { success: true, data: validatedData };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationError[] = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return { success: false, errors };
      }
      
      const genericError: ValidationError = {
        field: 'unknown',
        message: 'Validation failed',
        code: 'invalid_input'
      };

      return { success: false, errors: [genericError] };
    }
  };

  const createFieldValidator = (schema: z.ZodSchema) => {
    return (value: unknown) => {
      try {
        schema.parse(value);
        return { isValid: true, error: null };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            isValid: false,
            error: error.errors[0]?.message || 'Invalid value'
          };
        }
        return { isValid: false, error: 'Validation failed' };
      }
    };
  };

  // Real-time validation for forms
  const createRealTimeValidator = <T>(schema: z.ZodSchema<T>) => {
    let validationTimeout: NodeJS.Timeout;
    
    return (data: unknown, callback: (result: ValidationResult<T>) => void, delay: number = 300) => {
      clearTimeout(validationTimeout);
      
      validationTimeout = setTimeout(() => {
        const result = validateWithSchema(schema, data, false);
        callback(result);
      }, delay);
    };
  };

  return {
    validateWithSchema,
    validateFormData,
    validateStep,
    createCustomValidator,
    createFieldValidator,
    createRealTimeValidator
  };
};

// Common validation patterns
export const commonValidations = {
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Please enter a valid phone number'),
  url: z.string().url('Please enter a valid URL'),
  positiveNumber: z.number().positive('Must be a positive number'),
  nonEmptyString: z.string().min(1, 'This field is required'),
  uuid: z.string().uuid('Invalid ID format'),
  dateString: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    'Please enter a valid date'
  )
};
