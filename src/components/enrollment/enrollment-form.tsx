
'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Camera, Upload } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

interface EnrollmentFormProps<T extends z.ZodType<any, any>> {
  schema: T;
  onSubmit: (data: z.infer<T>) => void | Promise<void>;
  defaultValues?: Partial<z.infer<T>>;
  fieldsConfig: Array<{
    name: keyof z.infer<T>;
    label: string;
    type: 'text' | 'select' | 'file' | 'camera';
    placeholder?: string;
    options?: Array<{ value: string; label: string }>;
  }>;
  categoryName: string;
}

export function EnrollmentForm<T extends z.ZodType<any, any>>({
  schema,
  onSubmit,
  defaultValues,
  fieldsConfig,
  categoryName,
}: EnrollmentFormProps<T>) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);

  const handleFormSubmit = async (data: z.infer<T>) => {
    try {
      await onSubmit(data);
      toast({
        title: "Enrollment Successful",
        description: `${categoryName} has been registered.`,
      });
      form.reset();
      setPhotoPreview(null);
    } catch (error) {
      toast({
        title: "Enrollment Failed",
        description: `Could not register ${categoryName}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: FileList | null) => void) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      fieldChange(event.target.files);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      fieldChange(null);
      setPhotoPreview(null);
    }
  };

  const renderFormControl = (config: typeof fieldsConfig[0], field: any) => {
    if (config.type === 'text') {
      return <Input placeholder={config.placeholder} {...field} value={field.value || ''} />;
    }
    if (config.type === 'select' && config.options) {
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger>
            <SelectValue placeholder={config.placeholder} />
          </SelectTrigger>
          <SelectContent>
            {config.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    if (config.type === 'file') {
      return (
         <div className="flex items-center gap-2">
          <Button type="button" variant="outline" asChild>
             <label htmlFor={String(config.name)} className="cursor-pointer flex items-center gap-2">
              <Upload className="h-4 w-4" /> Choose File
            </label>
          </Button>
          <Input
            id={String(config.name)}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, field.onChange)}
            ref={field.ref}
          />
          {field.value && (field.value as FileList)[0] && (
            <span className="text-sm text-muted-foreground truncate max-w-xs">
              {(field.value as FileList)[0].name}
            </span>
          )}
        </div>
      );
    }
    if (config.type === 'camera') {
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="w-48 h-48 rounded-md border border-dashed bg-muted flex items-center justify-center overflow-hidden">
            {photoPreview ? (
              <Image src={photoPreview} alt="Photo preview" width={192} height={192} className="object-cover" data-ai-hint="portrait person"/>
            ) : (
              <Camera className="h-16 w-16 text-muted-foreground" />
            )}
          </div>
          <Input
            id={String(config.name)}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e, field.onChange)}
            ref={field.ref}
          />
          <Button type="button" variant="outline" onClick={() => document.getElementById(String(config.name))?.click()}>
            <Camera className="mr-2 h-4 w-4" /> Capture via Camera
          </Button>
          <p className="text-xs text-muted-foreground">Click to simulate camera capture (uses file upload)</p>
        </div>
      );
    }
    console.error(`Unrecognized field type: ${config.type} for field ${String(config.name)}`);
    return <div>Unsupported field type: {config.type}</div>; // Fallback to ensure Slot gets a child
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {fieldsConfig.map((config) => (
            <FormField
              key={String(config.name)}
              control={form.control}
              name={config.name as any}
              render={({ field }) => (
                <FormItem className={config.type === 'camera' ? 'md:col-span-2' : ''}>
                  <FormLabel>{config.label}</FormLabel>
                  <FormControl>
                    {renderFormControl(config, field)}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button type="submit" className="w-full md:w-auto">
          Register {categoryName}
        </Button>
      </form>
    </Form>
  );
}
