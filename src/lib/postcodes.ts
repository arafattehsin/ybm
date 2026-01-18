// Greater Sydney Postcode Zones for Delivery
// Custom zones with specific pricing

export interface PostcodeZone {
  name: string;
  postcodes: string[];
  deliveryFee: number; // in cents
}

// Greater Sydney delivery zones with postcodes
// Each postcode appears only once, in its highest-priced zone
export const SYDNEY_POSTCODE_ZONES: PostcodeZone[] = [
  {
    name: 'Zone A - Free Delivery',
    postcodes: ['2118'],
    deliveryFee: 0 // FREE
  },
  {
    name: 'Zone B - $15 Delivery',
    postcodes: [
      '2114', '2115', '2116', '2117', '2119', '2121', '2122', '2125', '2126',
      '2128', '2151', '2152'
    ],
    deliveryFee: 1500 // $15
  },
  {
    name: 'Zone C - $20 Delivery',
    postcodes: ['2120', '2154'],
    deliveryFee: 2000 // $20
  },
  {
    name: 'Zone D - $22 Delivery',
    postcodes: [
      '2067', '2072', '2073', '2076', '2111', '2112', '2113', '2127', '2135',
      '2138', '2140', '2141', '2142', '2144', '2146', '2153', '2160'
    ],
    deliveryFee: 2200 // $22
  },
  {
    name: 'Zone E - $25 Delivery',
    postcodes: [
      '2039', '2045', '2046', '2047', '2062', '2063', '2064', '2065', '2066',
      '2069', '2070', '2071', '2074', '2075', '2077', '2079', '2110', '2132',
      '2134', '2136', '2137', '2143', '2145', '2147', '2155', '2158', '2161',
      '2162', '2163', '2164', '2190', '2191', '2199'
    ],
    deliveryFee: 2500 // $25
  },
  {
    name: 'Zone F - $25 Delivery',
    postcodes: [
      '2007', '2008', '2009', '2037', '2038', '2040', '2041', '2048', '2049',
      '2050', '2060', '2061', '2068', '2087', '2088', '2089', '2090', '2130',
      '2131', '2133', '2148', '2156', '2165', '2166', '2192', '2193', '2194',
      '2195', '2196', '2197', '2198', '2200', '2203', '2204', '2209', '2763',
      '2768', '2769'
    ],
    deliveryFee: 2500 // $25
  },
  {
    name: 'Zone G - $30 Delivery',
    postcodes: [
      '2000', '2010', '2011', '2015', '2016', '2017', '2018', '2020', '2021',
      '2022', '2023', '2024', '2025', '2027', '2028', '2029', '2033', '2042',
      '2043', '2044', '2080', '2081', '2082', '2085', '2086', '2100', '2159',
      '2168', '2175', '2176', '2177', '2206', '2207', '2208', '2210', '2211',
      '2212', '2214', '2218', '2220', '2221', '2222', '2223', '2761', '2762',
      '2766', '2767'
    ],
    deliveryFee: 3000 // $30
  },
  {
    name: 'Zone H - $32 Delivery',
    postcodes: [
      '2026', '2030', '2031', '2032', '2093', '2094', '2096', '2097', '2099',
      '2101', '2103', '2104', '2170', '2171', '2173', '2174', '2178', '2205',
      '2213', '2216', '2217', '2219', '2224', '2234', '2748', '2759'
    ],
    deliveryFee: 3200 // $32
  },
  {
    name: 'Zone I - $35 Delivery',
    postcodes: [
      '2019', '2034', '2035', '2036', '2084', '2095', '2105', '2106', '2157',
      '2167', '2172', '2225', '2226', '2227', '2229', '2230', '2232', '2564',
      '2565', '2760', '2765', '2770'
    ],
    deliveryFee: 3500 // $35
  },
  {
    name: 'Zone J - $37 Delivery',
    postcodes: [
      '2083', '2107', '2179', '2228', '2231', '2557', '2747', '2750', '2756'
    ],
    deliveryFee: 3700 // $37
  },
  {
    name: 'Zone K - $40 Delivery',
    postcodes: [
      '2108', '2233', '2250', '2556', '2558', '2559', '2560', '2566', '2567',
      '2745', '2749', '2753', '2754', '2757', '2773', '2774'
    ],
    deliveryFee: 4000 // $40
  }
];

// Check if postcode is valid for delivery
export function getDeliveryFeeByPostcode(postcode: string): number | null {
  const normalizedPostcode = postcode.trim();
  
  for (const zone of SYDNEY_POSTCODE_ZONES) {
    if (zone.postcodes.includes(normalizedPostcode)) {
      return zone.deliveryFee;
    }
  }
  
  return null; // Postcode not in delivery range
}

// Get zone name by postcode
export function getZoneNameByPostcode(postcode: string): string | null {
  const normalizedPostcode = postcode.trim();
  
  for (const zone of SYDNEY_POSTCODE_ZONES) {
    if (zone.postcodes.includes(normalizedPostcode)) {
      return zone.name;
    }
  }
  
  return null;
}

// Check if delivery is available for postcode
export function isDeliveryAvailable(postcode: string): boolean {
  return getDeliveryFeeByPostcode(postcode) !== null;
}
