
import { supabase } from '@/integrations/supabase/client';
import { useBaseService } from '../base/baseService';

export interface DataQualityRule {
  id: string;
  name: string;
  description: string;
  ruleType: 'validation' | 'consistency' | 'completeness' | 'accuracy';
  condition: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  autoFix: boolean;
  isActive: boolean;
}

export interface DataQualityIssue {
  id: string;
  ruleId: string;
  entityType: string;
  entityId: string;
  issueType: string;
  severity: string;
  description: string;
  suggestedFix?: string;
  isResolved: boolean;
  detectedAt: string;
  resolvedAt?: string;
}

export interface DataQualityReport {
  organizationId: string;
  reportDate: string;
  overallScore: number;
  totalRecords: number;
  issuesFound: number;
  criticalIssues: number;
  categoryScores: Record<string, number>;
  trendData: Array<{
    date: string;
    score: number;
    issues: number;
  }>;
}

export const useAttainmentDataQuality = () => {
  const { handleError, handleSuccess } = useBaseService();

  const runDataQualityCheck = async (
    organizationId: string,
    scope: 'all' | 'co_attainments' | 'po_attainments' | 'assessments'
  ): Promise<DataQualityIssue[]> => {
    try {

      const issues: DataQualityIssue[] = [];

      // Check CO Attainments
      if (scope === 'all' || scope === 'co_attainments') {
        const coIssues = await checkCOAttainmentQuality(organizationId);
        issues.push(...coIssues);
      }

      // Check PO Attainments
      if (scope === 'all' || scope === 'po_attainments') {
        const poIssues = await checkPOAttainmentQuality(organizationId);
        issues.push(...poIssues);
      }

      // Check Assessment Data
      if (scope === 'all' || scope === 'assessments') {
        const assessmentIssues = await checkAssessmentDataQuality(organizationId);
        issues.push(...assessmentIssues);
      }

      // Store issues in database
      if (issues.length > 0) {
        await storeDataQualityIssues(issues);
      }

      handleSuccess(`Data quality check completed. Found ${issues.length} issues.`);
      return issues;
    } catch (error) {
      handleError(error, 'run data quality check');
      return [];
    }
  };

  const checkCOAttainmentQuality = async (organizationId: string): Promise<DataQualityIssue[]> => {
    const issues: DataQualityIssue[] = [];

    try {
      // Get CO attainments data
      const { data: coAttainments, error } = await supabase
        .from('co_attainments')
        .select(`
          *,
          courses!inner(
            semesters(
              academic_years(
                programs(organization_id)
              )
            )
          )
        `)
        .eq('courses.semesters.academic_years.programs.organization_id', organizationId);

      if (error) throw error;

      coAttainments?.forEach(attainment => {
        // Check for missing data
        if (!attainment.achieved_percentage || attainment.achieved_percentage < 0 || attainment.achieved_percentage > 100) {
          issues.push({
            id: `co_attainment_${attainment.id}_percentage`,
            ruleId: 'invalid_percentage',
            entityType: 'co_attainment',
            entityId: attainment.id,
            issueType: 'validation',
            severity: 'high',
            description: `Invalid achieved percentage: ${attainment.achieved_percentage}`,
            suggestedFix: 'Review calculation method and input data',
            isResolved: false,
            detectedAt: new Date().toISOString()
          });
        }

        // Check for inconsistent student counts
        if (attainment.students_passed > attainment.students_evaluated) {
          issues.push({
            id: `co_attainment_${attainment.id}_student_count`,
            ruleId: 'inconsistent_student_count',
            entityType: 'co_attainment',
            entityId: attainment.id,
            issueType: 'consistency',
            severity: 'critical',
            description: 'Students passed exceeds students evaluated',
            suggestedFix: 'Verify assessment data and recalculate',
            isResolved: false,
            detectedAt: new Date().toISOString()
          });
        }

        // Check for missing calculation method
        if (!attainment.calculation_method) {
          issues.push({
            id: `co_attainment_${attainment.id}_method`,
            ruleId: 'missing_calculation_method',
            entityType: 'co_attainment',
            entityId: attainment.id,
            issueType: 'completeness',
            severity: 'medium',
            description: 'Calculation method not specified',
            suggestedFix: 'Update attainment record with calculation method',
            isResolved: false,
            detectedAt: new Date().toISOString()
          });
        }
      });
    } catch (error) {
      console.error('Error checking CO attainment quality:', error);
    }

    return issues;
  };

  const checkPOAttainmentQuality = async (organizationId: string): Promise<DataQualityIssue[]> => {
    const issues: DataQualityIssue[] = [];

    try {
      const { data: poAttainments, error } = await supabase
        .from('po_attainments')
        .select(`
          *,
          programs!inner(organization_id)
        `)
        .eq('programs.organization_id', organizationId);

      if (error) throw error;

      poAttainments?.forEach(attainment => {
        // Check for invalid attainment values
        if (!attainment.attainment_value || attainment.attainment_value < 0 || attainment.attainment_value > 3) {
          issues.push({
            id: `po_attainment_${attainment.id}_value`,
            ruleId: 'invalid_attainment_value',
            entityType: 'po_attainment',
            entityId: attainment.id,
            issueType: 'validation',
            severity: 'high',
            description: `Invalid attainment value: ${attainment.attainment_value} (should be 0-3)`,
            suggestedFix: 'Review CO-PO mapping and calculation',
            isResolved: false,
            detectedAt: new Date().toISOString()
          });
        }

        // Check for missing contributing courses - safe access to JSON
        const contributingCourses = attainment.contributing_courses;
        let hasContributingCourses = false;
        
        if (contributingCourses && typeof contributingCourses === 'object') {
          if (Array.isArray(contributingCourses)) {
            hasContributingCourses = contributingCourses.length > 0;
          } else {
            hasContributingCourses = Object.keys(contributingCourses).length > 0;
          }
        }
        
        if (!hasContributingCourses) {
          issues.push({
            id: `po_attainment_${attainment.id}_courses`,
            ruleId: 'missing_contributing_courses',
            entityType: 'po_attainment',
            entityId: attainment.id,
            issueType: 'completeness',
            severity: 'medium',
            description: 'No contributing courses identified',
            suggestedFix: 'Verify CO-PO mappings and course data',
            isResolved: false,
            detectedAt: new Date().toISOString()
          });
        }
      });
    } catch (error) {
      console.error('Error checking PO attainment quality:', error);
    }

    return issues;
  };

  const checkAssessmentDataQuality = async (organizationId: string): Promise<DataQualityIssue[]> => {
    const issues: DataQualityIssue[] = [];

    try {
      const { data: assessments, error } = await supabase
        .from('student_assessments')
        .select(`
          *,
          courses(
            semesters(
              academic_years(
                programs(organization_id)
              )
            )
          )
        `)
        .eq('courses.semesters.academic_years.programs.organization_id', organizationId);

      if (error) throw error;

      assessments?.forEach(assessment => {
        // Check for missing CO scores - safe JSON access
        const coScores = assessment.co_scores;
        let hasCoScores = false;
        
        if (coScores && typeof coScores === 'object' && !Array.isArray(coScores)) {
          hasCoScores = Object.keys(coScores).length > 0;
        }
        
        if (!hasCoScores) {
          issues.push({
            id: `assessment_${assessment.id}_co_scores`,
            ruleId: 'missing_co_scores',
            entityType: 'student_assessment',
            entityId: assessment.id,
            issueType: 'completeness',
            severity: 'high',
            description: 'Missing CO scores data',
            suggestedFix: 'Re-upload assessment with CO score mappings',
            isResolved: false,
            detectedAt: new Date().toISOString()
          });
        }

        // Check for invalid max marks
        if (assessment.max_marks <= 0) {
          issues.push({
            id: `assessment_${assessment.id}_max_marks`,
            ruleId: 'invalid_max_marks',
            entityType: 'student_assessment',
            entityId: assessment.id,
            issueType: 'validation',
            severity: 'medium',
            description: 'Invalid max marks value',
            suggestedFix: 'Update assessment with correct max marks',
            isResolved: false,
            detectedAt: new Date().toISOString()
          });
        }
      });
    } catch (error) {
      console.error('Error checking assessment data quality:', error);
    }

    return issues;
  };

  const storeDataQualityIssues = async (issues: DataQualityIssue[]): Promise<void> => {
    try {
      const { error } = await supabase
        .from('data_quality_issues')
        .upsert(issues.map(issue => ({
          id: issue.id,
          issue_type: issue.issueType,
          severity: issue.severity,
          entity_type: issue.entityType,
          entity_id: issue.entityId,
          description: issue.description,
          details: { suggestedFix: issue.suggestedFix },
          status: 'open'
        })), {
          onConflict: 'id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error storing data quality issues:', error);
    }
  };

  const generateDataQualityReport = async (organizationId: string): Promise<DataQualityReport | null> => {
    try {
      // Get all issues for the organization
      const issues = await runDataQualityCheck(organizationId, 'all');
      
      const criticalIssues = issues.filter(issue => issue.severity === 'critical').length;
      const totalRecords = await getTotalRecordsCount(organizationId);
      
      // Calculate overall score (100 - percentage of critical issues)
      const overallScore = Math.max(0, 100 - ((criticalIssues / Math.max(totalRecords, 1)) * 100));
      
      // Get trend data (simplified)
      const trendData = await getQualityTrendData(organizationId);
      
      return {
        organizationId,
        reportDate: new Date().toISOString(),
        overallScore,
        totalRecords,
        issuesFound: issues.length,
        criticalIssues,
        categoryScores: {
          validation: calculateCategoryScore(issues, 'validation'),
          consistency: calculateCategoryScore(issues, 'consistency'),
          completeness: calculateCategoryScore(issues, 'completeness'),
          accuracy: calculateCategoryScore(issues, 'accuracy')
        },
        trendData
      };
    } catch (error) {
      handleError(error, 'generate data quality report');
      return null;
    }
  };

  const getTotalRecordsCount = async (organizationId: string): Promise<number> => {
    try {
      const [coCount, poCount, assessmentCount] = await Promise.all([
        supabase.from('co_attainments').select('count', { count: 'exact' }),
        supabase.from('po_attainments').select('count', { count: 'exact' }),
        supabase.from('student_assessments').select('count', { count: 'exact' })
      ]);

      return (coCount.count || 0) + (poCount.count || 0) + (assessmentCount.count || 0);
    } catch (error) {
      return 0;
    }
  };

  const calculateCategoryScore = (issues: DataQualityIssue[], category: string): number => {
    const categoryIssues = issues.filter(issue => issue.issueType === category);
    const criticalInCategory = categoryIssues.filter(issue => issue.severity === 'critical').length;
    
    if (categoryIssues.length === 0) return 100;
    return Math.max(0, 100 - ((criticalInCategory / categoryIssues.length) * 100));
  };

  const getQualityTrendData = async (organizationId: string): Promise<Array<{date: string; score: number; issues: number}>> => {
    // Simplified trend data - in production, this would pull from historical quality checks
    return [
      { date: '2024-01-01', score: 85, issues: 15 },
      { date: '2024-02-01', score: 88, issues: 12 },
      { date: '2024-03-01', score: 92, issues: 8 }
    ];
  };

  return {
    runDataQualityCheck,
    generateDataQualityReport
  };
};
