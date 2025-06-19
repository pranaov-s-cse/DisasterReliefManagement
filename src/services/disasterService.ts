export class DisasterService {
  private static instance: DisasterService;

  private constructor() {}

  public static getInstance(): DisasterService {
    return DisasterService.instance ?? (DisasterService.instance = new DisasterService());
  }
}
