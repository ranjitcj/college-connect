export interface ClassData {
  classrooms: Array<{
    branches: Array<{
      branchName: string;
      code: string;
      years: {
        [key: string]: {
          code: string;
          [key: string]:
            | {
                strength: number;
                subjects: string[];
              }
            | string;
        };
      };
    }>;
  }>;
}
