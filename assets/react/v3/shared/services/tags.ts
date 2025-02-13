import { useToast } from '@TutorShared/atoms/Toast';
import { wpAuthApiInstance } from '@TutorShared/utils/api';
import endpoints from '@TutorShared/utils/endpoints';
import type { ErrorResponse } from '@TutorShared/utils/form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { convertToErrorMessage } from '@TutorShared/utils/util';

export interface Tag {
  id: number;
  name: string;
}

interface getTagListParams {
  search: string;
}

interface CreateTagPayload {
  name: string;
}

interface CreateTagResponse {
  data: Tag;
}

const getTagList = (params: getTagListParams) => {
  return wpAuthApiInstance.get<Tag[]>(endpoints.TAGS, { params });
};

export const useTagListQuery = (params: getTagListParams) => {
  return useQuery({
    queryKey: ['TagList', params],
    queryFn: () => getTagList(params).then((res) => res.data),
  });
};

const createTag = (payload: CreateTagPayload) => {
  return wpAuthApiInstance.post<CreateTagPayload, CreateTagResponse>(endpoints.TAGS, payload);
};

export const useCreateTagMutation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['TagList'],
      });
    },
    onError: (error: ErrorResponse) => {
      // @TODO: Need to add proper type definition for wp rest api errors
      showToast({ type: 'danger', message: convertToErrorMessage(error) });
    },
  });
};
