import React from 'react';
import { XAxis as OriginalXAxis } from 'recharts';  // Adjust import based on your library
import type { FunctionComponent, SVGProps } from 'react';
import { BaseAxisProps, AxisInterval } from 'recharts/types/util/types'; // Adjust import based on your library

interface XAxisProps extends BaseAxisProps {
    xAxisId?: string | number;
    width?: number;
    height?: number;
    mirror?: boolean;
    orientation?: 'top' | 'bottom';
    ticks?: (string | number)[];
    padding?: {
        left?: number;
        right?: number;
    } | 'gap' | 'no-gap';
    minTickGap?: number;
    interval?: AxisInterval;
    reversed?: boolean;
    angle?: number;
    tickMargin?: number;
}

type Props = Omit<SVGProps<SVGElement>, 'scale'> & XAxisProps;

const CustomXAxis: FunctionComponent<Props> = ({
    mirror = false,
    orientation = 'bottom',
    reversed = false,
    ...rest
}) => {
    return <OriginalXAxis mirror={mirror} orientation={orientation} reversed={reversed} {...rest} />;
};

export default CustomXAxis;
