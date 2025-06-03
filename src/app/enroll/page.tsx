'use client';

import React from 'react';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnrollmentForm } from '@/components/enrollment/enrollment-form';

// Define Zod schemas for each category
const studentSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  studentId: z.string().min(5, { message: 'Student ID must be at least 5 characters.' }),
  department: z.string().min(1, { message: 'Please select a department.' }),
  yearLevel: z.string().min(1, { message: 'Please select a year level.' }),
  photo: z.instanceof(FileList).optional().nullable()
    .refine(files => files === null || files === undefined || files.length === 0 || (files?.[0]?.size ?? 0) <= 5 * 1024 * 1024, `Max file size is 5MB.`)
    .refine(files => files === null || files === undefined || files.length === 0 || (files?.[0]?.type?.startsWith("image/") ?? false), "Only images are allowed."),
});

const staffSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  employeeId: z.string().min(5, { message: 'Employee ID must be at least 5 characters.' }),
  staffDepartment: z.string().min(1, { message: 'Please select a department.' }),
  position: z.string().min(2, { message: 'Position must be at least 2 characters.' }),
  photo: z.instanceof(FileList).optional().nullable()
  .refine(files => files === null || files === undefined || files.length === 0 || (files?.[0]?.size ?? 0) <= 5 * 1024 * 1024, `Max file size is 5MB.`)
  .refine(files => files === null || files === undefined || files.length === 0 || (files?.[0]?.type?.startsWith("image/") ?? false), "Only images are allowed."),
});

const visitorSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  idType: z.string().min(1, { message: 'Please select an ID type.' }),
  idNumber: z.string().min(3, { message: 'ID Number must be at least 3 characters.' }),
  purposeOfVisit: z.string().min(5, { message: 'Purpose of visit must be at least 5 characters.' }),
  photo: z.instanceof(FileList).optional().nullable()
  .refine(files => files === null || files === undefined || files.length === 0 || (files?.[0]?.size ?? 0) <= 5 * 1024 * 1024, `Max file size is 5MB.`)
  .refine(files => files === null || files === undefined || files.length === 0 || (files?.[0]?.type?.startsWith("image/") ?? false), "Only images are allowed."),
});

type StudentData = z.infer<typeof studentSchema>;
type StaffData = z.infer<typeof staffSchema>;
type VisitorData = z.infer<typeof visitorSchema>;

const studentFieldsConfig: Array<{name: keyof StudentData, label: string, type: 'text' | 'select' | 'file' | 'camera', placeholder?: string, options?: Array<{value: string, label: string}>}> = [
  { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter full name' },
  { name: 'studentId', label: 'Student ID', type: 'text', placeholder: 'Enter student ID' },
  { name: 'department', label: 'Department', type: 'select', placeholder: 'Select department', options: [
    { value: 'cs', label: 'Computer Science' }, { value: 'eng', label: 'Engineering' }, { value: 'arts', label: 'Arts & Humanities' }
  ]},
  { name: 'yearLevel', label: 'Year Level', type: 'select', placeholder: 'Select year level', options: [
    { value: '1', label: '1st Year' }, { value: '2', label: '2nd Year' }, { value: '3', label: '3rd Year' }, { value: '4', label: '4th Year' }
  ]},
  { name: 'photo', label: 'Photo', type: 'camera' },
];

const teachingStaffFieldsConfig: Array<{name: keyof StaffData, label: string, type: 'text' | 'select' | 'file' | 'camera', placeholder?: string, options?: Array<{value: string, label: string}>}> = [
  { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter full name' },
  { name: 'employeeId', label: 'Employee ID', type: 'text', placeholder: 'Enter employee ID' },
  { name: 'staffDepartment', label: 'Department', type: 'select', placeholder: 'Select department', options: [
    { value: 'cs_faculty', label: 'Computer Science Faculty' }, { value: 'eng_faculty', label: 'Engineering Faculty' }, { value: 'math_dept', label: 'Mathematics Department'}
  ]},
  { name: 'position', label: 'Position/Rank', type: 'text', placeholder: 'e.g., Professor, Lecturer' },
  { name: 'photo', label: 'Photo', type: 'camera' },
];

const nonTeachingStaffFieldsConfig: Array<{name: keyof StaffData, label: string, type: 'text' | 'select' | 'file' | 'camera', placeholder?: string, options?: Array<{value: string, label: string}>}> = [
  { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter full name' },
  { name: 'employeeId', label: 'Employee ID', type: 'text', placeholder: 'Enter employee ID' },
  { name: 'staffDepartment', label: 'Department/Office', type: 'select', placeholder: 'Select department/office', options: [
    { value: 'admin', label: 'Administration' }, { value: 'library', label: 'Library' }, { value: 'maintenance', label: 'Maintenance' }
  ]},
  { name: 'position', label: 'Position', type: 'text', placeholder: 'e.g., Admin Assistant, Librarian' },
  { name: 'photo', label: 'Photo', type: 'camera' },
];

const visitorFieldsConfig: Array<{name: keyof VisitorData, label: string, type: 'text' | 'select' | 'file' | 'camera', placeholder?: string, options?: Array<{value: string, label: string}>}> = [
  { name: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Enter full name' },
  { name: 'idType', label: 'ID Type', type: 'select', placeholder: 'Select ID type', options: [
    { value: 'national_id', label: 'National ID' }, { value: 'passport', label: 'Passport' }, { value: 'drivers_license', label: 'Driver\'s License' }
  ]},
  { name: 'idNumber', label: 'ID Number', type: 'text', placeholder: 'Enter ID number' },
  { name: 'purposeOfVisit', label: 'Purpose of Visit', type: 'text', placeholder: 'State purpose of visit' },
  { name: 'photo', label: 'Photo', type: 'camera' },
];

export default function EnrollPage() {
  const handleStudentSubmit = (data: StudentData) => {
    console.log('Student Data:', data);
    // Here you would typically send data to your backend
  };

  const handleStaffSubmit = (data: StaffData) => {
    console.log('Staff Data:', data);
  };

  const handleVisitorSubmit = (data: VisitorData) => {
    console.log('Visitor Data:', data);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <h1 className="text-3xl font-bold tracking-tight">User Enrollment</h1>
      <Card className="flex flex-col flex-1">
        <CardContent className="pt-6 flex flex-col flex-1">
          <Tabs defaultValue="students" className="flex flex-col flex-1">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="teaching-staff">Teaching Staff</TabsTrigger>
              <TabsTrigger value="non-teaching-staff">Non-Teaching Staff</TabsTrigger>
              <TabsTrigger value="visitors">Visitors/Guardians</TabsTrigger>
            </TabsList>
            <TabsContent value="students" className="mt-6 flex-1">
              <EnrollmentForm
                schema={studentSchema}
                onSubmit={handleStudentSubmit}
                fieldsConfig={studentFieldsConfig}
                categoryName="Student"
              />
            </TabsContent>
            <TabsContent value="teaching-staff" className="mt-6 flex-1">
              <EnrollmentForm
                schema={staffSchema}
                onSubmit={handleStaffSubmit}
                fieldsConfig={teachingStaffFieldsConfig}
                categoryName="Teaching Staff"
              />
            </TabsContent>
            <TabsContent value="non-teaching-staff" className="mt-6 flex-1">
             <EnrollmentForm
                schema={staffSchema}
                onSubmit={handleStaffSubmit}
                fieldsConfig={nonTeachingStaffFieldsConfig}
                categoryName="Non-Teaching Staff"
              />
            </TabsContent>
            <TabsContent value="visitors" className="mt-6 flex-1">
              <EnrollmentForm
                schema={visitorSchema}
                onSubmit={handleVisitorSubmit}
                fieldsConfig={visitorFieldsConfig}
                categoryName="Visitor"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
