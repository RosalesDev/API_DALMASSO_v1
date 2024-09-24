import { methods as companyService } from "../services/companyService";

const getCompanyList = async (req, res) => {
  const companyList = await companyService.getCompanies();
  res.json(companyList);
};

export const methods = {
  getCompanyList,
};
