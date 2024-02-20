import React from 'react';
import PropTypes from 'prop-types';
import { InlineStack, Text } from '@shopify/polaris';
import './ColorPicker.css'
const ColorPicker = ({ label, value, onChange }) => {
    return (
        <div className='Color-Inputs'>
            <InlineStack align='space-between'>
                <Text variant="bodyMd" as="p">
                    {label}
                </Text>
                <div className='flex gap-5 items-center min-w-[100px]'>
                    <label className="Color-Circle Color-Circle-Border "
                        style={{
                            backgroundColor:
                                value,
                        }}>
                        <input
                            type="color"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                        />
                    </label>
                    <Text variant="bodyMd" as="h4">
                        {value}
                    </Text>
                </div>
            </InlineStack>
        </div>
    );
};

ColorPicker.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    label: PropTypes.string,
};

export default ColorPicker;
