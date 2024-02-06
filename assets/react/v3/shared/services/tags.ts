import { useToast } from '@Atoms/Toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authWPApiInstance } from '@Utils/api';
import endpoints from '@Utils/endpoints';

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

const getTagList = (params: getTagListParams) => {
  return authWPApiInstance.get<Tag[]>(endpoints.TAGS, { params });
};

export const useTagListQuery = (params: getTagListParams) => {
  return useQuery({
    queryKey: ['TagList', params],
    queryFn: () => getTagList(params).then((res) => res.data),
  });
};

const createTag = (payload: CreateTagPayload) => {
  return authWPApiInstance.post<CreateTagPayload, Tag>(endpoints.TAGS, payload);
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
    onError: (error) => {
      // @TODO: Need to add proper type definition for wp rest api errors
      showToast({ type: 'danger', message: error.response.data.message });
    },
  });
};
