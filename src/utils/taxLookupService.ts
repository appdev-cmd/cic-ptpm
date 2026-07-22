/**
 * Tax Code Lookup Service using VietQR Business API
 * API Endpoint: https://api.vietqr.io/v2/business/{taxCode}
 */

export interface TaxLookupResult {
  id: string;              // Mã số thuế
  name: string;            // Tên doanh nghiệp
  internationalName: string | null;
  shortName: string | null;
  address: string;         // Địa chỉ
  status: string;          // Tình trạng hoạt động
}

interface VietQRResponse {
  code: string;   // "00" = success
  desc: string;
  data: TaxLookupResult | null;
}

export const TaxLookupService = {
  /**
   * Tra cứu thông tin doanh nghiệp theo Mã Số Thuế
   */
  lookup: async (taxCode: string): Promise<TaxLookupResult | null> => {
    const cleaned = taxCode.trim().replace(/[^0-9-]/g, '');
    if (!cleaned || cleaned.length < 10) {
      throw new Error('Mã số thuế phải có ít nhất 10 chữ số.');
    }

    const response = await fetch(`https://api.vietqr.io/v2/business/${cleaned}`);

    if (!response.ok) {
      throw new Error(`Không thể kết nối API tra cứu (${response.status})`);
    }

    const json: VietQRResponse = await response.json();

    if (json.code !== '00' || !json.data) {
      return null;
    }

    return json.data;
  },

  /**
   * Tạo Mã Code viết tắt từ Tên công ty hoặc Tên viết tắt
   */
  generateShortCode: (name: string, shortName?: string | null): string => {
    if (shortName && shortName.trim().length >= 2 && shortName.trim().length <= 10) {
      return shortName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    }

    // Loại bỏ các từ vô nghĩa như CÔNG TY, TỔNG CÔNG TY, CỔ PHẦN, TNHH, ...
    const cleaned = name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
      .replace(/Đ/g, 'D')
      .replace(/đ/g, 'd')
      .toUpperCase()
      .replace(/CONG TY|TONG CONG TY|CO PHAN|TNHH|MOT THANH VIEN|MTV|TNHH 1 TV/g, '')
      .trim();

    const words = cleaned.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return 'KH' + Math.floor(Math.random() * 1000);
    
    if (words.length <= 4) {
      return words.map(w => w[0]).join('');
    }

    return words.slice(0, 4).map(w => w[0]).join('');
  }
};
