"use client"

import { endAttendance, getAttendanceStatus, markAsPresent, startAttendance } from '@/actions/classes'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QRCodeSVG } from 'qrcode.react'
import { Scanner, IDetectedBarcode } from '@yudiel/react-qr-scanner'
import { AlertCircle, CheckCircle2, QrCode, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const CreateAttendance = ({
  userId,
  teacherId,
  classId,
  email,
}: {
  userId: string
  teacherId: string
  classId: number
  email: string
}) => {
  const [isActive, setIsActive] = useState(false)
  const [qrValue, setQrValue] = useState('')
  const [showScanner, setShowScanner] = useState(false)
  const [scanError, setScanError] = useState('')
  const [scanSuccess, setScanSuccess] = useState(false)

  const fetchAttendanceStatus = async () => {
    const { isActive: activeStatus, qrCode } = await getAttendanceStatus(classId)
    setIsActive(activeStatus)
    setQrValue(qrCode || '')
  }

  const handleStartClass = async () => {
    await startAttendance(classId)
    await fetchAttendanceStatus()
  }

  const handleEndClass = async () => {
    await endAttendance(classId)
    setIsActive(false)
    setQrValue('')
  }

  const handleScan = async (detectedCodes: IDetectedBarcode[]) => {
    try {
      const scannedText = detectedCodes[0]?.rawValue
      
      if (!scannedText) {
        return
      }

      const { qrCode: activeQrCode } = await getAttendanceStatus(classId)
      
      if (scannedText === activeQrCode) {
        await markAsPresent(email, classId)
        setShowScanner(false)
        setScanSuccess(true)
        setScanError('')
      } else {
        setScanError('Invalid QR code')
        setScanSuccess(false)
      }
    } catch (error) {
      setScanError('Error processing QR code')
      setScanSuccess(false)
    }
  }

  useEffect(() => {
    fetchAttendanceStatus()
  }, [classId])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{userId === teacherId ? "Manage Class" : "Mark Attendance"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {userId === teacherId ? (
          // Teacher View
          <div className="space-y-4">
            {isActive ? (
              <>
                <Card className="p-4 bg-secondary">
                  <div className="flex flex-col items-center space-y-4">
                    {qrValue && (
                      <div className="w-full max-w-[256px] aspect-square">
                        <QRCodeSVG value={qrValue} width="100%" height="100%" level="H" />
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Show this QR code to your students
                    </p>
                  </div>
                </Card>
                <Button onClick={handleEndClass} className="w-full" variant="destructive">
                  End Class
                </Button>
              </>
            ) : (
              <Button onClick={handleStartClass} className="w-full">
                Start Class
              </Button>
            )}
          </div>
        ) : (
          // Student View
          <div className="space-y-4">
            {showScanner ? (
              <Card className="p-4">
                <div className="space-y-4">
                  <div className="aspect-square w-full max-w-[300px] mx-auto relative">
                    <Scanner 
                      onScan={handleScan}
                      onError={(error) => {
                        setScanError('Failed to scan QR code')
                        console.error(error)
                      }}
                      styles={{
                        container: {
                          height: '100%',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                        }
                      }}
                    />
                  </div>
                  {scanError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{scanError}</AlertDescription>
                    </Alert>
                  )}
                  <Button 
                    onClick={() => setShowScanner(false)}
                    variant="outline" 
                    className="w-full"
                  >
                    <X className="mr-2 h-4 w-4" /> Cancel Scanning
                  </Button>
                </div>
              </Card>
            ) : (
              <>
                <Button 
                  onClick={() => setShowScanner(true)} 
                  disabled={!isActive}
                  className="w-full"
                >
                  <QrCode className="mr-2 h-4 w-4" /> Scan QR Code
                </Button>
                {scanSuccess && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Your attendance has been marked successfully.</AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
export default CreateAttendance
