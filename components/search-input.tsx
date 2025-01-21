"use client";

import qs from 'query-string';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';

export const SearchInput = () => {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currenCategoryId = searchParams.get("categoryId");

    useEffect(() => {
        const query = qs.stringify({
            categoryId: currenCategoryId,
            title: debouncedValue,
        }, { skipEmptyString: true, skipNull: true });

        const url = `${pathname}?${query}`;

        router.push(url);
    }, [debouncedValue, currenCategoryId, router, pathname]);

    return (
        <div className="relative">
            <Search
                className="h-4 w-4 absolute top-3 left text-slate-600"
            />
            <Input
                onChange={(e) => setValue(e.target.value) }
                value={value}
                className="w-full md:w-[300px] pl-9 rounded-full bg_slate-100
                focus-visible:ring-slate-200"
                placeholder="Buscar un curso"/>
        </div>
    )
}