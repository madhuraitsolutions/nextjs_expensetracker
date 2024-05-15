import React from 'react';
import { YAxis as OriginalYAxis } from 'recharts';  // Replace 'your-library' with the actual library name
import type { FunctionComponent, SVGProps } from 'react';
import { BaseAxisProps, AxisInterval } from 'recharts/types/util/types'; // Adjust import based on your library

interface YAxisProps extends BaseAxisProps {
    yAxisId?: string | number;
    ticks?: (string | number)[];
    width?: number;
    height?: number;
    mirror?: boolean;
    orientation?: 'left' | 'right';
    padding?: {
        top?: number;
        bottom?: number;
    };
    minTickGap?: number;
    interval?: AxisInterval;
    reversed?: boolean;
    tickMargin?: number;
}

type Props = Omit<SVGProps<SVGElement>, 'scale'> & YAxisProps;

const CustomYAxis: FunctionComponent<Props> = ({
    mirror = false,
    orientation = 'left',
    reversed = false,
    ...rest
}) => {
    return <OriginalYAxis mirror={mirror} orientation={orientation} reversed={reversed} {...rest} />;
};

export default CustomYAxis;
