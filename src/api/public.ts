const baseUrl = import.meta.env.VITE_HOLIDAY_API_URL;
const apiKey = import.meta.env.VITE_HOLIDAY_API_KEY;

type Params = {
  solYear: number;
  solMonth: number;
  _type?: "json";
  numOfRows?: string;
  ServiceKey?: string;
};

type Item = {
  item: {
    /**
     * 종류
     */
    dateKind: "01";
    /**
     * 명칭 (ex. 삼일절, 추석)
     */
    dateName: string;
    /**
     * 공공기관 휴일여부
     */
    isHoliday: "Y";
    /**
     * 날짜 (ex. 20240916)
     */
    locdate: number;
    /**
     * 순번
     */
    seq: number;
  }[];
};

type Response = {
  response: {
    header: {
      /**
       * 결과코드
       * 00: 성공
       */
      resultCode: "00";
      /**
       * 결과메시지 (ex. NORMAL SERVICE.)
       */
      resultMsg: string;
    };
    body: {
      items: string | Item;
      numOfRows: 10;
      pageNo: 1;
      totalCount: 0;
    };
  };
};

export const getHolidays = async (params: Params) => {
  const newParams = {
    ...params,
    solYear: String(params.solYear),
    solMonth: get2digitMonth(params.solMonth),
    ServiceKey: apiKey,
    _type: "json",
  };
  const query = new URLSearchParams(newParams).toString();

  const result = await fetch(`${baseUrl}/getRestDeInfo?${query}`);
  const data: Response = await result.json();

  return data.response.body.items;
};

const get2digitMonth = (month: number) => {
  if (month < 10) return "0" + String(month);
  return String(month);
};
