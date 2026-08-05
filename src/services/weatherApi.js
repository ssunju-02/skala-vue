import axios from 'axios'

const weatherApi = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  timeout: 10000,
})

const weatherMetricsApi = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 10000,
})

export const WEATHER_CITIES = [
  { id: 'city_01', name: '서울', lat: 37.5665, lon: 126.978 },
  { id: 'city_02', name: '판교', lat: 37.3947, lon: 127.1112 },
  { id: 'city_03', name: '전주', lat: 35.8242, lon: 127.148 },
]

export const KOREA_WEATHER_REGIONS = [
  { id: 'region_seoul', name: '서울', lat: 37.5665, lon: 126.978 },
  { id: 'region_busan', name: '부산', lat: 35.1796, lon: 129.0756 },
  { id: 'region_daegu', name: '대구', lat: 35.8714, lon: 128.6014 },
  { id: 'region_incheon', name: '인천', lat: 37.4563, lon: 126.7052 },
  { id: 'region_gwangju', name: '광주', lat: 35.1595, lon: 126.8526 },
  { id: 'region_daejeon', name: '대전', lat: 36.3504, lon: 127.3845 },
  { id: 'region_ulsan', name: '울산', lat: 35.5384, lon: 129.3114 },
  { id: 'region_sejong', name: '세종', lat: 36.48, lon: 127.289 },
  { id: 'region_gyeonggi', name: '경기', lat: 37.2636, lon: 127.0286 },
  { id: 'region_gangwon', name: '강원', lat: 37.8813, lon: 127.7298 },
  { id: 'region_chungbuk', name: '충북', lat: 36.6424, lon: 127.489 },
  { id: 'region_chungnam', name: '충남', lat: 36.6012, lon: 126.6608 },
  { id: 'region_jeonbuk', name: '전북', lat: 35.8242, lon: 127.148 },
  { id: 'region_jeonnam', name: '전남', lat: 34.9904, lon: 126.4817 },
  { id: 'region_gyeongbuk', name: '경북', lat: 36.5684, lon: 128.7294 },
  { id: 'region_gyeongnam', name: '경남', lat: 35.2279, lon: 128.6811 },
  { id: 'region_jeju', name: '제주', lat: 33.4996, lon: 126.5312 },
]

export const KOREA_CITY_DIRECTORY = [
  { id: 'sgg_0', name: '강원 강릉시', lat: 37.7519, lon: 128.8783 },
  { id: 'sgg_1', name: '강원 고성군', lat: 38.3794, lon: 128.4675 },
  { id: 'sgg_2', name: '강원 동해시', lat: 37.5234, lon: 129.1136 },
  { id: 'sgg_3', name: '강원 삼척시', lat: 37.4501, lon: 129.1663 },
  { id: 'sgg_4', name: '강원 속초시', lat: 38.2073, lon: 128.5927 },
  { id: 'sgg_5', name: '강원 양구군', lat: 38.1058, lon: 127.9894 },
  { id: 'sgg_6', name: '강원 양양군', lat: 38.0622, lon: 128.6147 },
  { id: 'sgg_7', name: '강원 영월군', lat: 37.1833, lon: 128.4615 },
  { id: 'sgg_8', name: '강원 원주시', lat: 37.321, lon: 127.9213 },
  { id: 'sgg_9', name: '강원 인제군', lat: 38.0442, lon: 128.2788 },
  { id: 'sgg_10', name: '강원 정선군', lat: 37.3891, lon: 128.73 },
  { id: 'sgg_11', name: '강원 철원군', lat: 38.2439, lon: 127.4452 },
  { id: 'sgg_12', name: '강원 춘천시', lat: 37.8805, lon: 127.7278 },
  { id: 'sgg_13', name: '강원 태백시', lat: 37.1652, lon: 128.9857 },
  { id: 'sgg_14', name: '강원 평창군', lat: 37.3703, lon: 128.3931 },
  { id: 'sgg_15', name: '강원 홍천군', lat: 37.6918, lon: 127.8857 },
  { id: 'sgg_16', name: '강원 화천군', lat: 38.1421, lon: 127.6762 },
  { id: 'sgg_17', name: '강원 횡성군', lat: 37.4882, lon: 127.9857 },
  { id: 'sgg_18', name: '경기 가평군', lat: 37.8308, lon: 127.5152 },
  { id: 'sgg_19', name: '경기 고양시', lat: 37.6564, lon: 126.835 },
  { id: 'sgg_20', name: '경기 과천시', lat: 37.4341, lon: 126.9999 },
  { id: 'sgg_21', name: '경기 광명시', lat: 37.4444, lon: 126.865 },
  { id: 'sgg_22', name: '경기 광주시', lat: 37.4291, lon: 127.2551 },
  { id: 'sgg_23', name: '경기 구리시', lat: 37.5986, lon: 127.1394 },
  { id: 'sgg_24', name: '경기 군포시', lat: 37.3426, lon: 126.9215 },
  { id: 'sgg_25', name: '경기 김포시', lat: 37.5942, lon: 126.7425 },
  { id: 'sgg_26', name: '경기 남양주시', lat: 37.6522, lon: 127.2401 },
  { id: 'sgg_27', name: '경기 동두천시', lat: 37.9189, lon: 127.069 },
  { id: 'sgg_28', name: '경기 부천시', lat: 37.4989, lon: 126.7831 },
  { id: 'sgg_29', name: '경기 성남시', lat: 37.4188, lon: 127.1288 },
  { id: 'sgg_30', name: '경기 수원시', lat: 37.2859, lon: 127.0099 },
  { id: 'sgg_31', name: '경기 시흥시', lat: 37.3907, lon: 126.7888 },
  { id: 'sgg_32', name: '경기 안산시', lat: 37.3169, lon: 126.8305 },
  { id: 'sgg_33', name: '경기 안성시', lat: 37.0379, lon: 127.3006 },
  { id: 'sgg_34', name: '경기 안양시', lat: 37.3925, lon: 126.9269 },
  { id: 'sgg_35', name: '경기 양주시', lat: 37.8173, lon: 127.046 },
  { id: 'sgg_36', name: '경기 양평군', lat: 37.4888, lon: 127.4922 },
  { id: 'sgg_37', name: '경기 여주시', lat: 37.2956, lon: 127.6367 },
  { id: 'sgg_38', name: '경기 연천군', lat: 38.094, lon: 127.0758 },
  { id: 'sgg_39', name: '경기 오산시', lat: 37.1522, lon: 127.0706 },
  { id: 'sgg_40', name: '경기 용인시', lat: 37.2383, lon: 127.1779 },
  { id: 'sgg_41', name: '경기 의왕시', lat: 37.345, lon: 126.9758 },
  { id: 'sgg_42', name: '경기 의정부시', lat: 37.7386, lon: 127.0477 },
  { id: 'sgg_43', name: '경기 이천시', lat: 37.2792, lon: 127.4425 },
  { id: 'sgg_44', name: '경기 파주시', lat: 37.7595, lon: 126.7777 },
  { id: 'sgg_45', name: '경기 평택시', lat: 36.9947, lon: 127.0889 },
  { id: 'sgg_46', name: '경기 포천시', lat: 37.8937, lon: 127.2003 },
  { id: 'sgg_47', name: '경기 하남시', lat: 37.5389, lon: 127.2125 },
  { id: 'sgg_48', name: '경기 화성시', lat: 37.2002, lon: 126.8291 },
  { id: 'sgg_49', name: '경남 거제시', lat: 34.9, lon: 128.6667 },
  { id: 'sgg_50', name: '경남 거창군', lat: 35.6874, lon: 127.9114 },
  { id: 'sgg_51', name: '경남 고성군', lat: 35.0148, lon: 128.2824 },
  { id: 'sgg_52', name: '경남 김해시', lat: 35.25, lon: 128.8667 },
  { id: 'sgg_53', name: '경남 남해군', lat: 34.8043, lon: 127.9271 },
  { id: 'sgg_54', name: '경남 밀양시', lat: 35.4933, lon: 128.7489 },
  { id: 'sgg_55', name: '경남 사천시', lat: 35.0038, lon: 128.0686 },
  { id: 'sgg_56', name: '경남 산청군', lat: 35.3663, lon: 127.8706 },
  { id: 'sgg_57', name: '경남 양산시', lat: 35.3987, lon: 129.0361 },
  { id: 'sgg_58', name: '경남 의령군', lat: 35.3923, lon: 128.2692 },
  { id: 'sgg_59', name: '경남 진주시', lat: 35.2045, lon: 128.1241 },
  { id: 'sgg_60', name: '경남 창녕군', lat: 35.5082, lon: 128.4902 },
  { id: 'sgg_61', name: '경남 창원시', lat: 35.2753, lon: 128.6515 },
  { id: 'sgg_62', name: '경남 통영시', lat: 34.8736, lon: 128.3971 },
  { id: 'sgg_63', name: '경남 하동군', lat: 35.1363, lon: 127.7729 },
  { id: 'sgg_64', name: '경남 함안군', lat: 35.2912, lon: 128.4297 },
  { id: 'sgg_65', name: '경남 함양군', lat: 35.5523, lon: 127.712 },
  { id: 'sgg_66', name: '경남 합천군', lat: 35.5741, lon: 128.1384 },
  { id: 'sgg_67', name: '경북 경산시', lat: 35.8333, lon: 128.8 },
  { id: 'sgg_68', name: '경북 경주시', lat: 35.8428, lon: 129.2117 },
  { id: 'sgg_69', name: '경북 고령군', lat: 35.7496, lon: 128.2971 },
  { id: 'sgg_70', name: '경북 구미시', lat: 36.2101, lon: 128.3544 },
  { id: 'sgg_71', name: '경북 군위군', lat: 36.17, lon: 128.6471 },
  { id: 'sgg_72', name: '경북 김천시', lat: 36.1448, lon: 128.1116 },
  { id: 'sgg_73', name: '경북 문경시', lat: 36.5946, lon: 128.1995 },
  { id: 'sgg_74', name: '경북 봉화군', lat: 36.8895, lon: 128.7357 },
  { id: 'sgg_75', name: '경북 상주시', lat: 36.4167, lon: 128.1667 },
  { id: 'sgg_76', name: '경북 성주군', lat: 35.9189, lon: 128.2884 },
  { id: 'sgg_77', name: '경북 안동시', lat: 36.5664, lon: 128.7227 },
  { id: 'sgg_78', name: '경북 영덕군', lat: 36.4813, lon: 129.3108 },
  { id: 'sgg_79', name: '경북 영양군', lat: 36.6959, lon: 129.142 },
  { id: 'sgg_80', name: '경북 영주시', lat: 36.8746, lon: 128.5863 },
  { id: 'sgg_81', name: '경북 영천시', lat: 36.0, lon: 129.0 },
  { id: 'sgg_82', name: '경북 예천군', lat: 36.6527, lon: 128.4301 },
  { id: 'sgg_83', name: '경북 울릉군', lat: 37.5044, lon: 130.8608 },
  { id: 'sgg_84', name: '경북 울진군', lat: 36.9197, lon: 129.3197 },
  { id: 'sgg_85', name: '경북 의성군', lat: 36.3612, lon: 128.6152 },
  { id: 'sgg_86', name: '경북 청도군', lat: 35.6717, lon: 128.7851 },
  { id: 'sgg_87', name: '경북 청송군', lat: 36.4329, lon: 129.0516 },
  { id: 'sgg_88', name: '경북 칠곡군', lat: 36.0151, lon: 128.4614 },
  { id: 'sgg_89', name: '경북 포항시', lat: 36.0833, lon: 129.3667 },
  { id: 'sgg_90', name: '광주 광산구', lat: 35.1616, lon: 126.8081 },
  { id: 'sgg_91', name: '광주 남구', lat: 35.1216, lon: 126.9094 },
  { id: 'sgg_92', name: '광주 동구', lat: 35.1459, lon: 126.9232 },
  { id: 'sgg_93', name: '광주 북구', lat: 35.1923, lon: 126.9244 },
  { id: 'sgg_94', name: '광주 서구', lat: 35.1525, lon: 126.8911 },
  { id: 'sgg_95', name: '대구 남구', lat: 35.8412, lon: 128.588 },
  { id: 'sgg_96', name: '대구 달서구', lat: 35.8257, lon: 128.524 },
  { id: 'sgg_97', name: '대구 달성군', lat: 35.7747, lon: 128.4296 },
  { id: 'sgg_98', name: '대구 동구', lat: 35.8857, lon: 128.633 },
  { id: 'sgg_99', name: '대구 북구', lat: 35.9, lon: 128.5917 },
  { id: 'sgg_100', name: '대구 서구', lat: 35.8747, lon: 128.5511 },
  { id: 'sgg_101', name: '대구 수성구', lat: 35.8591, lon: 128.6262 },
  { id: 'sgg_102', name: '대구 중구', lat: 35.8668, lon: 128.5954 },
  { id: 'sgg_103', name: '대전 대덕구', lat: 36.3959, lon: 127.4344 },
  { id: 'sgg_104', name: '대전 동구', lat: 36.3294, lon: 127.4431 },
  { id: 'sgg_105', name: '대전 서구', lat: 36.2807, lon: 127.3453 },
  { id: 'sgg_106', name: '대전 유성구', lat: 36.3668, lon: 127.327 },
  { id: 'sgg_107', name: '대전 중구', lat: 36.2804, lon: 127.4109 },
  { id: 'sgg_108', name: '부산 강서구', lat: 35.1593, lon: 128.933 },
  { id: 'sgg_109', name: '부산 금정구', lat: 35.2586, lon: 129.0901 },
  { id: 'sgg_110', name: '부산 기장군', lat: 35.2972, lon: 129.2008 },
  { id: 'sgg_111', name: '부산 남구', lat: 35.1365, lon: 129.0827 },
  { id: 'sgg_112', name: '부산 동구', lat: 35.1247, lon: 129.0343 },
  { id: 'sgg_113', name: '부산 동래구', lat: 35.2045, lon: 129.078 },
  { id: 'sgg_114', name: '부산 부산진구', lat: 35.1629, lon: 129.0513 },
  { id: 'sgg_115', name: '부산 북구', lat: 35.1972, lon: 128.9913 },
  { id: 'sgg_116', name: '부산 사상구', lat: 35.1448, lon: 128.9799 },
  { id: 'sgg_117', name: '부산 사하구', lat: 35.0855, lon: 128.9872 },
  { id: 'sgg_118', name: '부산 서구', lat: 35.1253, lon: 129.0195 },
  { id: 'sgg_119', name: '부산 수영구', lat: 35.1563, lon: 129.1125 },
  { id: 'sgg_120', name: '부산 연제구', lat: 35.1821, lon: 129.0829 },
  { id: 'sgg_121', name: '부산 영도구', lat: 35.0785, lon: 129.0648 },
  { id: 'sgg_122', name: '부산 중구', lat: 35.1059, lon: 129.0333 },
  { id: 'sgg_123', name: '부산 해운대구', lat: 35.1666, lon: 129.1679 },
  { id: 'sgg_124', name: '서울 강남구', lat: 37.4951, lon: 127.0628 },
  { id: 'sgg_125', name: '서울 강동구', lat: 37.5527, lon: 127.1455 },
  { id: 'sgg_126', name: '서울 강북구', lat: 37.6349, lon: 127.0202 },
  { id: 'sgg_127', name: '서울 강서구', lat: 37.5623, lon: 126.8162 },
  { id: 'sgg_128', name: '서울 관악구', lat: 37.4788, lon: 126.9523 },
  { id: 'sgg_129', name: '서울 광진구', lat: 37.5391, lon: 127.0837 },
  { id: 'sgg_130', name: '서울 구로구', lat: 37.4945, lon: 126.8502 },
  { id: 'sgg_131', name: '서울 금천구', lat: 37.4749, lon: 126.8911 },
  { id: 'sgg_132', name: '서울 노원구', lat: 37.6604, lon: 127.0672 },
  { id: 'sgg_133', name: '서울 도봉구', lat: 37.6507, lon: 127.0301 },
  { id: 'sgg_134', name: '서울 동대문구', lat: 37.5819, lon: 127.0541 },
  { id: 'sgg_135', name: '서울 동작구', lat: 37.5006, lon: 126.9515 },
  { id: 'sgg_136', name: '서울 마포구', lat: 37.5544, lon: 126.9093 },
  { id: 'sgg_137', name: '서울 서대문구', lat: 37.5781, lon: 126.9351 },
  { id: 'sgg_138', name: '서울 서초구', lat: 37.4945, lon: 127.0109 },
  { id: 'sgg_139', name: '서울 성동구', lat: 37.5478, lon: 127.0246 },
  { id: 'sgg_140', name: '서울 성북구', lat: 37.6027, lon: 127.0145 },
  { id: 'sgg_141', name: '서울 송파구', lat: 37.5021, lon: 127.1111 },
  { id: 'sgg_142', name: '서울 양천구', lat: 37.5206, lon: 126.8747 },
  { id: 'sgg_143', name: '서울 영등포구', lat: 37.5261, lon: 126.9031 },
  { id: 'sgg_144', name: '서울 용산구', lat: 37.5339, lon: 126.9775 },
  { id: 'sgg_145', name: '서울 은평구', lat: 37.6185, lon: 126.9278 },
  { id: 'sgg_146', name: '서울 종로구', lat: 37.5729, lon: 126.9793 },
  { id: 'sgg_147', name: '서울 중구', lat: 37.5599, lon: 126.994 },
  { id: 'sgg_148', name: '서울 중랑구', lat: 37.602, lon: 127.1046 },
  { id: 'sgg_149', name: '울산 남구', lat: 35.5438, lon: 129.3292 },
  { id: 'sgg_150', name: '울산 동구', lat: 35.5047, lon: 129.4186 },
  { id: 'sgg_151', name: '울산 북구', lat: 35.5824, lon: 129.3605 },
  { id: 'sgg_152', name: '울산 울주군', lat: 35.5623, lon: 129.1269 },
  { id: 'sgg_153', name: '울산 중구', lat: 35.5684, lon: 129.3323 },
  { id: 'sgg_154', name: '인천 강화군', lat: 37.7472, lon: 126.4856 },
  { id: 'sgg_155', name: '인천 계양구', lat: 37.5231, lon: 126.7447 },
  { id: 'sgg_156', name: '인천 남구', lat: 37.4636, lon: 126.65 },
  { id: 'sgg_157', name: '인천 남동구', lat: 37.4183, lon: 126.7184 },
  { id: 'sgg_158', name: '인천 동구', lat: 37.4838, lon: 126.6369 },
  { id: 'sgg_159', name: '인천 부평구', lat: 37.4972, lon: 126.7111 },
  { id: 'sgg_160', name: '인천 서구', lat: 37.5523, lon: 126.6554 },
  { id: 'sgg_161', name: '인천 연수구', lat: 37.4191, lon: 126.6649 },
  { id: 'sgg_162', name: '인천 옹진군', lat: 37.2336, lon: 126.1231 },
  { id: 'sgg_163', name: '인천 중구', lat: 37.4735, lon: 126.6215 },
  { id: 'sgg_164', name: '전남 강진군', lat: 34.6179, lon: 126.7676 },
  { id: 'sgg_165', name: '전남 고흥군', lat: 34.5833, lon: 127.3333 },
  { id: 'sgg_166', name: '전남 곡성군', lat: 35.2145, lon: 127.2628 },
  { id: 'sgg_167', name: '전남 광양시', lat: 35.0293, lon: 127.6488 },
  { id: 'sgg_168', name: '전남 구례군', lat: 35.2094, lon: 127.4644 },
  { id: 'sgg_169', name: '전남 나주시', lat: 35.0568, lon: 126.6736 },
  { id: 'sgg_170', name: '전남 담양군', lat: 35.3398, lon: 126.9912 },
  { id: 'sgg_171', name: '전남 목포시', lat: 34.8083, lon: 126.3942 },
  { id: 'sgg_172', name: '전남 무안군', lat: 34.9564, lon: 126.4404 },
  { id: 'sgg_173', name: '전남 보성군', lat: 34.8143, lon: 127.1577 },
  { id: 'sgg_174', name: '전남 순천시', lat: 34.9895, lon: 127.3955 },
  { id: 'sgg_175', name: '전남 신안군', lat: 34.8262, lon: 126.1086 },
  { id: 'sgg_176', name: '전남 여수시', lat: 34.7765, lon: 127.6425 },
  { id: 'sgg_177', name: '전남 영광군', lat: 35.2871, lon: 126.4362 },
  { id: 'sgg_178', name: '전남 영암군', lat: 34.7979, lon: 126.6265 },
  { id: 'sgg_179', name: '전남 완도군', lat: 34.3118, lon: 126.7385 },
  { id: 'sgg_180', name: '전남 장성군', lat: 35.3273, lon: 126.7682 },
  { id: 'sgg_181', name: '전남 장흥군', lat: 34.6667, lon: 126.9167 },
  { id: 'sgg_182', name: '전남 진도군', lat: 34.4102, lon: 126.1688 },
  { id: 'sgg_183', name: '전남 함평군', lat: 35.1164, lon: 126.5322 },
  { id: 'sgg_184', name: '전남 해남군', lat: 34.5405, lon: 126.5187 },
  { id: 'sgg_185', name: '전남 화순군', lat: 35.0084, lon: 127.0258 },
  { id: 'sgg_186', name: '전북 고창군', lat: 35.4348, lon: 126.7005 },
  { id: 'sgg_187', name: '전북 군산시', lat: 35.9358, lon: 126.6834 },
  { id: 'sgg_188', name: '전북 김제시', lat: 35.807, lon: 126.9076 },
  { id: 'sgg_189', name: '전북 남원시', lat: 35.4297, lon: 127.4321 },
  { id: 'sgg_190', name: '전북 무주군', lat: 35.9317, lon: 127.7112 },
  { id: 'sgg_191', name: '전북 부안군', lat: 35.7, lon: 126.6667 },
  { id: 'sgg_192', name: '전북 순창군', lat: 35.4167, lon: 127.1667 },
  { id: 'sgg_193', name: '전북 완주군', lat: 35.8451, lon: 127.1475 },
  { id: 'sgg_194', name: '전북 익산시', lat: 35.9439, lon: 126.9544 },
  { id: 'sgg_195', name: '전북 임실군', lat: 35.6066, lon: 127.2301 },
  { id: 'sgg_196', name: '전북 장수군', lat: 35.6667, lon: 127.5333 },
  { id: 'sgg_197', name: '전북 전주시', lat: 35.8219, lon: 127.1489 },
  { id: 'sgg_198', name: '전북 정읍시', lat: 35.6, lon: 126.9167 },
  { id: 'sgg_199', name: '전북 진안군', lat: 35.8216, lon: 127.4118 },
  { id: 'sgg_200', name: '제주 서귀포시', lat: 33.2931, lon: 126.4975 },
  { id: 'sgg_201', name: '제주 제주시', lat: 33.5097, lon: 126.5219 },
  { id: 'sgg_202', name: '충남 계룡시', lat: 36.293, lon: 127.2258 },
  { id: 'sgg_203', name: '충남 공주시', lat: 36.4556, lon: 127.1247 },
  { id: 'sgg_204', name: '충남 금산군', lat: 36.1338, lon: 127.4806 },
  { id: 'sgg_205', name: '충남 논산시', lat: 36.1977, lon: 127.1214 },
  { id: 'sgg_206', name: '충남 당진시', lat: 36.9167, lon: 126.6667 },
  { id: 'sgg_207', name: '충남 보령시', lat: 36.3565, lon: 126.5944 },
  { id: 'sgg_208', name: '충남 부여군', lat: 36.2626, lon: 126.858 },
  { id: 'sgg_209', name: '충남 서산시', lat: 36.7852, lon: 126.4657 },
  { id: 'sgg_210', name: '충남 서천군', lat: 36.1082, lon: 126.6972 },
  { id: 'sgg_211', name: '충남 아산시', lat: 36.7836, lon: 127.0042 },
  { id: 'sgg_212', name: '충남 예산군', lat: 36.6822, lon: 126.7959 },
  { id: 'sgg_213', name: '충남 천안시', lat: 36.8049, lon: 127.1943 },
  { id: 'sgg_214', name: '충남 청양군', lat: 36.4459, lon: 126.8429 },
  { id: 'sgg_215', name: '충남 태안군', lat: 36.7004, lon: 126.2839 },
  { id: 'sgg_216', name: '충남 홍성군', lat: 36.5671, lon: 126.6263 },
  { id: 'sgg_217', name: '충북 괴산군', lat: 36.7718, lon: 127.8143 },
  { id: 'sgg_218', name: '충북 단양군', lat: 36.9862, lon: 128.3695 },
  { id: 'sgg_219', name: '충북 보은군', lat: 36.4949, lon: 127.7287 },
  { id: 'sgg_220', name: '충북 영동군', lat: 36.1645, lon: 127.7902 },
  { id: 'sgg_221', name: '충북 옥천군', lat: 36.3012, lon: 127.568 },
  { id: 'sgg_222', name: '충북 음성군', lat: 36.926, lon: 127.6807 },
  { id: 'sgg_223', name: '충북 제천시', lat: 37.0621, lon: 128.1406 },
  { id: 'sgg_224', name: '충북 증평군', lat: 36.7838, lon: 127.5986 },
  { id: 'sgg_225', name: '충북 진천군', lat: 36.8567, lon: 127.4433 },
  { id: 'sgg_226', name: '충북 청주시', lat: 36.6372, lon: 127.4897 },
  { id: 'sgg_227', name: '충북 충주시', lat: 37.0179, lon: 127.8771 },
]
export const DEFAULT_WEATHER_LOCATIONS = [
  ...KOREA_WEATHER_REGIONS,
  ...WEATHER_CITIES.filter(({ id }) => id === 'city_02'),
]

export const ALL_WEATHER_LOCATIONS = [
  ...WEATHER_CITIES,
  ...KOREA_WEATHER_REGIONS,
  ...KOREA_CITY_DIRECTORY,
]

const getStatus = (weatherId) => {
  if (weatherId === 800) return '맑음'
  if (weatherId >= 200 && weatherId < 600) return '비'
  if (weatherId >= 600 && weatherId < 700) return '눈'
  if (weatherId >= 700 && weatherId < 800) return '안개'
  return '구름'
}

const getDescription = (weatherId) => {
  if (weatherId === 800) return '맑음'
  if (weatherId === 801) return '구름 조금'
  if (weatherId === 802 || weatherId === 803) return '구름 많음'
  if (weatherId === 804) return '흐림'
  if (weatherId >= 200 && weatherId < 300) return '뇌우'
  if (weatherId >= 300 && weatherId < 400) return '이슬비'
  if (weatherId === 500) return '약한 비'
  if (weatherId === 501) return '비'
  if (weatherId >= 502 && weatherId <= 504) return '강한 비'
  if (weatherId === 511) return '진눈깨비'
  if (weatherId >= 520 && weatherId < 600) return '소나기'
  if (weatherId === 600) return '약한 눈'
  if (weatherId === 601) return '눈'
  if (weatherId === 602) return '강한 눈'
  if (weatherId >= 611 && weatherId < 700) return '눈 섞인 비'
  if ([731, 751, 761].includes(weatherId)) return '황사'
  if (weatherId >= 700 && weatherId < 800) return '안개'
  return '구름 많음'
}

const fetchWeatherMetrics = async (city) => {
  try {
    const { data } = await weatherMetricsApi.get('/forecast', {
      params: {
        latitude: city.lat,
        longitude: city.lon,
        current: 'uv_index,precipitation',
        daily: 'precipitation_sum',
        forecast_days: 1,
        timezone: 'Asia/Seoul',
      },
    })
    return {
      uvIndex: Number.isFinite(data.current?.uv_index) ? data.current.uv_index : null,
      precipitation: Number.isFinite(data.current?.precipitation) ? data.current.precipitation : null,
      precipitationForecast: Number.isFinite(data.daily?.precipitation_sum?.[0]) ? data.daily.precipitation_sum[0] : null,
    }
  } catch {
    return { uvIndex: null, precipitation: null, precipitationForecast: null }
  }
}

export const getUvLevel = (uvIndex) => {
  if (!Number.isFinite(uvIndex)) return '정보 없음'
  if (uvIndex < 3) return '낮음'
  if (uvIndex < 6) return '보통'
  if (uvIndex < 8) return '높음'
  if (uvIndex < 11) return '매우 높음'
  return '위험'
}

export const getAirQualityLevel = (airQualityIndex) =>
  ({ 1: '좋음', 2: '보통', 3: '주의', 4: '나쁨', 5: '매우 나쁨' })[airQualityIndex] ?? '정보 없음'

const getWindDirection = (degrees) => {
  if (!Number.isFinite(degrees)) return '—'
  const directions = ['북', '북동', '동', '남동', '남', '남서', '서', '북서']
  return directions[Math.round(degrees / 45) % directions.length]
}

const fetchAirQuality = async (city, apiKey) => {
  try {
    const { data } = await weatherApi.get('/air_pollution', {
      params: { lat: city.lat, lon: city.lon, appid: apiKey },
    })
    const current = data.list?.[0]
    return {
      airQualityIndex: current?.main?.aqi ?? null,
      pm25: current?.components?.pm2_5 ?? null,
      pm10: current?.components?.pm10 ?? null,
    }
  } catch {
    return { airQualityIndex: null, pm25: null, pm10: null }
  }
}

const normalizeWeather = (data, city, metrics, airQuality) => ({
  id: city.id,
  name: city.name,
  temp: Math.round(data.main.temp),
  feelsLike: Math.round(data.main.feels_like),
  humidity: data.main.humidity,
  status: getStatus(data.weather[0]?.id),
  description: getDescription(data.weather[0]?.id),
  observation: `${getDescription(data.weather[0]?.id)}이며, 체감 온도는 ${Math.round(data.main.feels_like)}도입니다.`,
  precipitation: data.rain?.['1h'] ?? data.snow?.['1h'] ?? metrics.precipitation ?? 0,
  precipitationForecast: metrics.precipitationForecast,
  uvIndex: metrics.uvIndex,
  pressure: data.main.pressure,
  visibility: data.visibility,
  clouds: data.clouds?.all ?? null,
  windSpeed: data.wind?.speed ?? null,
  windGust: data.wind?.gust ?? null,
  windDirection: getWindDirection(data.wind?.deg),
  sunrise: data.sys?.sunrise ?? null,
  sunset: data.sys?.sunset ?? null,
  updatedAt: data.dt ?? null,
  ...airQuality,
})

export const getWeatherErrorMessage = (error) => {
  if (error.code === 'WEATHER_KEY_MISSING') return '날씨 API 키가 설정되지 않았습니다. .env 파일을 확인해 주세요.'
  if (error.response?.status === 401) return '날씨 API 키가 유효하지 않거나 아직 활성화되지 않았습니다.'
  if (error.response?.status === 404) return '요청한 도시의 날씨 정보를 찾을 수 없습니다.'
  if (error.code === 'ECONNABORTED') return '날씨 서버 응답이 지연되고 있습니다. 잠시 후 다시 시도해 주세요.'
  return '날씨 정보를 불러오지 못했습니다. 네트워크 연결을 확인해 주세요.'
}

export const fetchCurrentWeather = async (city) => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY?.trim()
  if (!apiKey || apiKey.includes('여기에_')) {
    const error = new Error('OpenWeather API key is missing')
    error.code = 'WEATHER_KEY_MISSING'
    throw error
  }

  const [weatherResponse, metrics, airQuality] = await Promise.all([
    weatherApi.get('/weather', {
      params: { lat: city.lat, lon: city.lon, appid: apiKey, units: 'metric', lang: 'kr' },
    }),
    fetchWeatherMetrics(city),
    fetchAirQuality(city, apiKey),
  ])

  return normalizeWeather(weatherResponse.data, city, metrics, airQuality)
}
