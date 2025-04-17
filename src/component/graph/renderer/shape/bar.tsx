import React from 'react';
import { mergeClass } from '../../util';
import { AddSVGProps } from '../../model';

export type D3Bar = {
    className?: string,
    innerRef?: React.Ref<SVGRectElement>
}
export function D3Bar({
    className,
    innerRef,
    ...rest
}: AddSVGProps<D3Bar, SVGRectElement>) {
    return <rect
        ref={innerRef}
        className={mergeClass('d3-bar', className)}
        {...rest}
    />
}