type ToastType = 'success' | 'error' | 'warning' | 'info';

class ToastService {
  private static instance: ToastService;

  private constructor() {}

  public static getInstance(): ToastService {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService();
    }
    return ToastService.instance;
  }

  public show(message: string, type: ToastType = 'info') {
    // In a real app, this would use a proper toast library
    // For now, we'll use a simple alert
    alert(`${type.toUpperCase()}: ${message}`);
  }
}

export default ToastService;
