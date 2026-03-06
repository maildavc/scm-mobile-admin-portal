import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customerService } from "@/services/customerService";
import type {
  GetCustomersParams,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from "@/types/customer";

export const useGetCustomers = (params: GetCustomersParams) => {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => customerService.getCustomers(params),
  });
};

export const useGetCustomerDetails = (customerId: string) => {
  return useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => customerService.getCustomerDetails(customerId),
    enabled: !!customerId,
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCustomerRequest) =>
      customerService.createCustomer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      customerId,
      payload,
    }: {
      customerId: string;
      payload: UpdateCustomerRequest;
    }) => customerService.updateCustomer(customerId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({
        queryKey: ["customer", variables.customerId],
      });
    },
  });
};

export const useApproveRejectCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      customerId,
      action,
    }: {
      customerId: string;
      action: "approve" | "reject";
    }) => customerService.approveRejectCustomer(customerId, action),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({
        queryKey: ["customer", variables.customerId],
      });
    },
  });
};

export const useDeactivateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      customerId,
      reason,
    }: {
      customerId: string;
      reason: string;
    }) => customerService.deactivateCustomer(customerId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({
        queryKey: ["customer", variables.customerId],
      });
    },
  });
};
