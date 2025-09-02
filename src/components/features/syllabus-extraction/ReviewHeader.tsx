
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export const ReviewHeader: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Review Enhanced AI-Extracted Data
        </CardTitle>
        <CardDescription>
          Review and edit the comprehensive information extracted from your syllabus before saving.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
