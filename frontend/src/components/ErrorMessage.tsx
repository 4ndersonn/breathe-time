import React from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <Box data-testid="error-state" sx={{ my: 3 }}>
      <Alert
        severity="error"
        action={
          onRetry ? (
            <Button color="inherit" size="small" onClick={onRetry}>
              Tentar novamente
            </Button>
          ) : undefined
        }
      >
        <AlertTitle>Erro ao carregar dados</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
};
