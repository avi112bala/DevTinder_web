import { useEffect, useRef } from "react";

export const _getUser = () => {
	// const stringifiedUser = sessionStorage.getItem('user');
	const stringifiedUser = localStorage.getItem('user');
	if (stringifiedUser && stringifiedUser !== 'undefined') {
		const localUser: any = JSON.parse(stringifiedUser);
		return localUser;
	}
	return null;
};

export const _clearData = ({ pushToLogin = true }) => {
	pathName() && localStorage.clear();
	if (pushToLogin) {
		window.location.href = "/";
	}
	return false;
};

export const pathName = () => typeof window !== "undefined" && window;

export const _getToken = () => {
	// const token = pathName() && sessionStorage.getItem("token");
	const stored: any = localStorage.getItem("user");
	const userCheck: any = JSON.parse(stored)
	let isDelegation = localStorage.getItem("isDelegation")
	if (userCheck?.role === "subadmin" && isDelegation === "yes") {
		const token = pathName() && localStorage.getItem("subadmintoken");
		return token
	} else {
		const token = pathName() && localStorage.getItem("token");
		return token;
	}

};

export const _isAnEmptyObject = (obj: any) => {
	for (const key in obj) {
		if (obj?.prototype?.hasOwnProperty?.call(key)) return false
		else return false
	}
	return true
}


export const _isAnEmptyObjectEcommerce = (obj: any) => {
	return obj && Object.keys(obj).length === 0;
};


export const _isUserLoggedIn = (): boolean => {
	const user = _getUser();
	const token = _getToken()
	if (!_isAnEmptyObject(user) && token !== undefined) {
		return true;
	}
	return false;

};

// utils/phoneFormatter.js
export const formatPhoneNumber = (phoneNumber: any, countryCode = null) => {
	if (!phoneNumber || phoneNumber === '--') return '--';

	// Remove any non-digit characters except plus sign
	const cleaned = phoneNumber.replace(/[^\d+]/g, '');

	// If country code is provided separately, use it
	if (countryCode) {
		const numberWithoutCode = cleaned.replace(new RegExp(`^\\+?${countryCode}`), '');
		return `+${countryCode} ${formatNumberParts(numberWithoutCode)}`;
	}

	// Auto-detect country code if not provided
	if (cleaned.startsWith('+234')) {
		return `+234 ${formatNumberParts(cleaned.slice(4))}`;
	} else if (cleaned.startsWith('234')) {
		return `+234 ${formatNumberParts(cleaned.slice(3))}`;
	}

	// Default formatting for other numbers
	return cleaned;
};

const formatNumberParts = (number: any) => {
	// Format as XXX XXX XXXX for most numbers
	if (number.length === 10) {
		return `${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
	}
	return number; // Return as is if doesn't match expected format
};


export const formatNumber = (value: number) => {
	return new Intl.NumberFormat().format(value)
}

const debounce = <T extends (...args: any[]) => void>(fn: T) => {
	let frame: number;

	return (...params: Parameters<T>) => {
		if (frame) {
			cancelAnimationFrame(frame);
		}

		frame = requestAnimationFrame(() => {
			fn(...params);
		});
	};
};

export const storeScroll = () => {
	document.documentElement.dataset.scroll = window.scrollY.toString();
};

export function getRandomElement<T>(arr: Array<T>): T {
	return arr[Math.floor(Math.random() * arr.length)]
}

document.addEventListener('scroll', debounce(storeScroll), { passive: true });

storeScroll();

export const validateEmail = (email: string) => {
	const re =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

export const removeEmptyObjectKeys = (obj: object) => {
	return Object.fromEntries(
		Object.entries(obj).filter(([, value]) =>
			value !== ""
			&& !(typeof value === "object" && value !== null && Object.keys(value).length === 0)
			&& value !== undefined
		)
	);
};

export const isDateBeforeAugust = () => {
	const now = new Date();
	const deadline = new Date(2025, 6, 31, 23, 59, 59);

	return now <= deadline
}

// export const toEpochSeconds = (date?: any, time?: string) => {
//   if (!date || !time) return null;

//   const iso = `${date?.trim()}T${time.trim()}:00`; // add seconds
//   const d = new Date(iso);

//   if (isNaN(d.getTime())) {
//     console.log("Invalid date:", iso);
//     return null;
//   }

//   return Math.floor(d.getTime() / 1000);
// };


export const toEpochSeconds = (date?: any, time = "00:00") => {
	if (!date) return null;

	const d = new Date(date);
	const [hours, minutes] = time.split(":").map(Number);

	d.setHours(hours, minutes, 0, 0);

	return Math.floor(d.getTime() / 1000);
};

export const epochToDate = (epoch: number): string => {
		if (!epoch || epoch <= 0) return "";

	const d = new Date(epoch * 1000);

	// Use local timezone to avoid date shifting
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
};

export const epochToTime = (epoch: number): string => {
		if (!epoch || epoch <= 0) return "";

	const d = new Date(epoch * 1000);

	const hours = String(d.getHours()).padStart(2, "0");
	const minutes = String(d.getMinutes()).padStart(2, "0");

	return `${hours}:${minutes}`;
};

export const epochToDateTime = (epoch: number): string => {
	const d = new Date(epoch * 1000);

	const day = String(d.getDate()).padStart(2, "0");

	const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	const month = monthNames[d.getMonth()];

	const year = d.getFullYear();

	let hours = d.getHours();
	const minutes = String(d.getMinutes()).padStart(2, "0");

	const ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	hours = hours ? hours : 12; // 0 becomes 12

	const formattedHours = String(hours).padStart(2, "0");

	return `${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`;
};

export const epochToDateMonth = (epoch: number): string => {
	const d = new Date(epoch * 1000);

	const day = String(d.getDate()).padStart(2, "0");

	const monthNames = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun",
		"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];

	const month = monthNames[d.getMonth()];

	return `${day} ${month}`;
};

export const getDateTime = (iso: any) => {
	const date = new Date(iso);

	const formattedDate = date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});

	const formattedTime = date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	return `${formattedDate}, ${formattedTime}`;
};


export const getDateTimeWithSeconds = (iso: any) => {
	const date = new Date(iso);

	const formattedDate = date.toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});

	const formattedTime = date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
	});

	return `${formattedDate}, ${formattedTime}`;
};







export const formatDuration = (seconds: number) => {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins > 0 ? `${mins}min.` : ""} ${secs} sec`;
};

export const base64UrlEncode = (str: any) => {
	return btoa(str)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=/g, '');
};
export const getSizeInMB = (sizeStr: any) => {
	if (!sizeStr) return 0;
	return parseFloat(sizeStr.replace("MB", "").trim());
};

export const toGB = (bytes: number): string => {
	const gb = bytes / (1024 ** 3);
	return gb < 0.01 ? "0.01" : gb.toFixed(2);
};


// Fires onIntersect when the ref element enters the viewport
export function useInfiniteScrollSentinel(
	onIntersect: () => void,
	enabled: boolean,
	rootRef: React.RefObject<HTMLDivElement | null>   // ← add this

) {
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!enabled || !ref.current) return;
		const el = ref.current;
		const observer = new IntersectionObserver(
			([entry]) => { if (entry.isIntersecting) onIntersect(); },
			{
				root: rootRef.current,   // ← scope to the scroll container
				threshold: 0.1
			}
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [onIntersect, enabled,rootRef]);
	return ref;
}


export const epochToDates = (epoch:any) => {
  if (!epoch) return "";
  return new Date(Number(epoch)).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};


export const epochToTimes = (epoch:any) => {
  if (!epoch) return "";
  return new Date(Number(epoch)).toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};