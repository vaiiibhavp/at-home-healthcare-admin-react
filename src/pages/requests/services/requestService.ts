import { RequestData } from '../RequestTypes';

// API function to fetch all requests with pagination
export const fetchRequests = async (page: number = 1, size: number = 10, status?: string) => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(status && { status })
    });
    
    // Get auth token from localStorage
    const token = localStorage.getItem('authToken');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/requests?${params}`, {
      method: 'GET',
      headers
    });
    
    const data = await response.json();
    
    if (data.status === 200) {
      // Transform API response to match component structure
      const transformedRequests = data.data.requests.map((apiRequest: any) => ({
        ...apiRequest,
        // Add backward compatibility properties
        doctor: {
          name: apiRequest.doctorName || 'Unknown Doctor',
          specialty: apiRequest.doctorSpeciality || 'Unknown Specialty',
          avatar: apiRequest.doctorProfileImage || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg'
        },
        patient: apiRequest.patientName || 'Unknown Patient',
        serviceType: apiRequest.serviceName || 'Unknown Service',
        dateCreated: apiRequest.createdAt ? new Date(apiRequest.createdAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : 'Unknown Date',
        lastUpdated: apiRequest.updatedAt ? new Date(apiRequest.updatedAt).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : 'Unknown Date',
        serviceColor: getServiceColor(apiRequest.status),
        formStatus: getFormStatus(apiRequest)
      }));
      
      return {
        requests: transformedRequests,
        pagination: data.data.pagination
      };
    } else {
      console.error('API Error:', data.message);
      return {
        requests: [],
        pagination: {
          total: 0,
          page: 1,
          size: size,
          totalPages: 0,
          totalRange: '0-0',
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    return {
      requests: [],
      pagination: {
        total: 0,
        page: 1,
        size: size,
        totalPages: 0,
        totalRange: '0-0',
        hasNextPage: false,
        hasPrevPage: false
      }
    };
  }
};

// API function to fetch detailed request data
export const fetchRequestDetails = async (requestId: string): Promise<RequestData | null> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No auth token found');
      return null;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/requests/${requestId}`, {
      method: 'GET',
      headers
    });
    
    const data = await response.json();
    
    if (data.status === 200) {
      return data.data;
    } else {
      console.error('API Error:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    return null;
  }
};

// API function to fetch audit logs
export const fetchAuditLogs = async (requestId: string): Promise<any[] | null> => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No auth token found');
      return null;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
    
    const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/admin/requests/${requestId}/audit-logs`, {
      method: 'GET',
      headers
    });
    
    const data = await response.json();
    
    if (data.status === 200) {
      return data.data.auditLogs;
    } else {
      console.error('API Error:', data.message);
      return null;
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    return null;
  }
};

// Helper function to get service color based on status
const getServiceColor = (status: string): string => {
  const colorMap = {
    pending: 'amber',
    completed: 'emerald',
    inprogress: 'blue',
    returned: 'red',
    draft: 'gray'
  };
  return colorMap[status as keyof typeof colorMap] || 'gray';
};

// Helper function to get form status based on request data
const getFormStatus = (request: any): string => {
  if (request.digitalSignature?.signedAt) {
    return 'SIGNED';
  }
  if (request.formData) {
    return 'SUBMITTED';
  }
  if (request.status === 'draft') {
    return 'DRAFT';
  }
  return 'PENDING';
};
