// Greater Sydney Postcode Zones for Delivery
// Based on WooCommerce configuration

export interface PostcodeZone {
  name: string;
  postcodes: string[];
  deliveryFee: number; // in cents
}

// Greater Sydney delivery zones with postcodes
export const SYDNEY_POSTCODE_ZONES: PostcodeZone[] = [
  {
    name: 'Inner Sydney',
    postcodes: [
      '2000', '2007', '2008', '2009', '2010', '2011', '2015', '2016', '2017', 
      '2018', '2020', '2021', '2022', '2023', '2024', '2025', '2026', '2027',
      '2028', '2029', '2030', '2031', '2032', '2033', '2034', '2035', '2036',
      '2037', '2038', '2039', '2040', '2041', '2042', '2043', '2044', '2045',
      '2046', '2047', '2048', '2049', '2050', '2060', '2061', '2062', '2063',
      '2064', '2065', '2066', '2067', '2068', '2069', '2070', '2071', '2072',
      '2073', '2074', '2075', '2076', '2077', '2079', '2080', '2081', '2082',
      '2083', '2084', '2085', '2086', '2087', '2088', '2089', '2090', '2091',
      '2092', '2093', '2094', '2095', '2096', '2097', '2099'
    ],
    deliveryFee: 1500 // $15
  },
  {
    name: 'Greater Sydney West',
    postcodes: [
      '2110', '2111', '2112', '2113', '2114', '2115', '2116', '2117', '2118',
      '2119', '2120', '2121', '2122', '2125', '2126', '2127', '2128', '2130',
      '2131', '2132', '2133', '2134', '2135', '2136', '2137', '2138', '2139',
      '2140', '2141', '2142', '2143', '2144', '2145', '2146', '2147', '2148',
      '2150', '2151', '2152', '2153', '2154', '2155', '2156', '2157', '2158',
      '2159', '2160', '2161', '2162', '2163', '2164', '2165', '2166', '2167',
      '2168', '2170', '2171', '2172', '2173', '2174', '2175', '2176', '2177',
      '2178', '2179', '2190', '2191', '2192', '2193', '2194', '2195', '2196',
      '2197', '2198', '2199', '2200', '2203', '2204', '2205', '2206', '2207',
      '2208', '2209', '2210', '2211', '2212', '2213', '2214', '2216', '2217',
      '2218', '2219', '2220', '2221', '2222', '2223', '2224', '2225', '2226',
      '2227', '2228', '2229', '2230', '2231', '2232', '2233', '2234'
    ],
    deliveryFee: 2000 // $20
  },
  {
    name: 'Greater Sydney North',
    postcodes: [
      '2250', '2251', '2256', '2257', '2259', '2260', '2261', '2262', '2263',
      '2264', '2265', '2267', '2280', '2281', '2282', '2283', '2284', '2285',
      '2286', '2287', '2289', '2290', '2291', '2292', '2293', '2294', '2295',
      '2296', '2297', '2298', '2299', '2300', '2302', '2303', '2304', '2305',
      '2306', '2307', '2308', '2315', '2316', '2317', '2318', '2319', '2320',
      '2321', '2322', '2323', '2324', '2325'
    ],
    deliveryFee: 2500 // $25
  },
  {
    name: 'Greater Sydney South',
    postcodes: [
      '2500', '2502', '2505', '2506', '2508', '2515', '2516', '2517', '2518',
      '2519', '2525', '2526', '2527', '2528', '2529', '2530', '2533', '2534',
      '2535', '2536', '2540'
    ],
    deliveryFee: 2500 // $25
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
