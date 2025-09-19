import { Button } from '@/components/ui/button'
import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import UploadedQuestionTable from './UploadedQuestionTable'
import { CreateQuestionUploadForm } from './CreateQuestionUploadForm'
import { useGetSingleQuestionPaperQuery } from '@/api/api/admin/question-paper'

const Grader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams<{ type: 'create' | 'edit' }>();
  const isFormMode = type === 'create' || type === 'edit';
  const searchParams = new URLSearchParams(location.search);
  const idParam = searchParams.get('id');
  const id = idParam ? Number(idParam) : undefined;

  const { data: detailData, isFetching: isFetchingDetail } = useGetSingleQuestionPaperQuery(
    { id: id as number },
    { skip: !isFormMode || !id }
  ) as any;
  return (
    <>
        {!isFormMode && (
          <div className='flex justify-end mb-4'>
              <Button
                variant='default'
                color='primary'
                onClick={() => navigate('/admin/grader/create')}
              >
                Upload Question Paper
              </Button>
          </div>
        )}
        {isFormMode ? (
          <div>
            <CreateQuestionUploadForm type={type as 'create' | 'edit'} initialData={detailData} loadingInitial={isFetchingDetail} />
          </div>
        ) : (
          <div>
            <UploadedQuestionTable />
          </div>
        )}
    </>
  )
}

export default Grader