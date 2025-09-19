import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";

interface DateTimePickerProps {
  name: string;
  label: string;
  control: any;
  required?: boolean;
  error?: any;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  name,
  label,
  control,
  required = false,
  error,
}) => {
  function handleDateSelect(date: Date | undefined, onChange: (date: Date) => void) {
    if (date) {
      onChange(date);
    }
  }

  function handleTimeChange(
    type: "hour" | "minute" | "ampm",
    value: string,
    onChange: (date: Date) => void,
    currentDate: Date
  ) {
    const newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    onChange(newDate);
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            <Label htmlFor={name} className="text-sm font-medium">
              {label}
              {required && <span className="text-red-500">*</span>}
            </Label>
          </FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full rounded-md border border-border !px-3 text-left font-normal",
                    field.value ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "dd/MM/yyyy hh:mm aa")
                  ) : (
                    <span>DD/MM/YYYY hh:mm aa</span>
                  )}
                  <Icon icon="mage:calendar-2" className="ml-auto h-6 w-6 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className={cn("w-auto p-0", "relative overflow-hidden")}>
              {/* Small Screen Layout */}
              <div className="sm:hidden">
                <div className="flex flex-col">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => handleDateSelect(date, field.onChange)}
                    initialFocus
                  />
                  <div className="flex divide-x">
                    <ScrollArea className="w-[120px] whitespace-nowrap rounded-md border">
                      <div className="flex p-2">
                        {Array.from({ length: 12 }, (_, i) => i + 1)
                          .reverse()
                          .map((hour) => (
                            <Button
                              key={hour}
                              size="icon"
                              className={cn(
                                "aspect-square shrink-0 text-[#020817] hover:bg-gray-200 hover:text-[#020817]",
                                field.value && field.value.getHours() % 12 === hour % 12
                                  ? "bg-[#020817] text-white"
                                  : "bg-transparent"
                              )}
                              onClick={() =>
                                handleTimeChange(
                                  "hour",
                                  hour.toString(),
                                  field.onChange,
                                  field.value || new Date()
                                )
                              }
                            >
                              {hour}
                            </Button>
                          ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                    <ScrollArea className="w-[120px]">
                      <div className="flex p-2">
                        {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                          <Button
                            key={minute}
                            size="icon"
                            className={cn(
                              "aspect-square shrink-0 text-[#020817] hover:bg-gray-200 hover:text-[#020817]",
                              field.value && field.value.getMinutes() === minute
                                ? "bg-[#020817] text-white"
                                : "bg-transparent"
                            )}
                            onClick={() =>
                              handleTimeChange(
                                "minute",
                                minute.toString(),
                                field.onChange,
                                field.value || new Date()
                              )
                            }
                          >
                            {minute.toString().padStart(2, "0")}
                          </Button>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                    <ScrollArea className="w-[80px]">
                      <div className="flex p-2">
                        {["AM", "PM"].map((ampm) => (
                          <Button
                            key={ampm}
                            size="icon"
                            className={cn(
                              "aspect-square shrink-0 text-[#020817] hover:bg-gray-200 hover:text-[#020817]",
                              field.value &&
                                ((ampm === "AM" && field.value.getHours() < 12) ||
                                  (ampm === "PM" && field.value.getHours() >= 12))
                                ? "bg-[#020817] text-white"
                                : "bg-transparent"
                            )}
                            onClick={() =>
                              handleTimeChange(
                                "ampm",
                                ampm,
                                field.onChange,
                                field.value || new Date()
                              )
                            }
                          >
                            {ampm}
                          </Button>
                        ))}
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                </div>
              </div>

              {/* Large Screen Layout */}
              <div className="hidden sm:block">
                <div className="sm:flex">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => handleDateSelect(date, field.onChange)}
                    initialFocus
                  />
                  <div className="flex flex-col divide-y sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0">
                    <ScrollArea className="h-[300px]">
                      <div className="flex p-2 sm:flex-col">
                        {Array.from({ length: 12 }, (_, i) => i + 1)
                          .reverse()
                          .map((hour) => (
                            <Button
                              key={hour}
                              size="icon"
                              className={cn(
                                "aspect-square shrink-0 text-[#020817] hover:bg-gray-200 hover:text-[#020817]",
                                field.value && field.value.getHours() % 12 === hour % 12
                                  ? "bg-[#020817] text-white"
                                  : "bg-transparent"
                              )}
                              onClick={() =>
                                handleTimeChange(
                                  "hour",
                                  hour.toString(),
                                  field.onChange,
                                  field.value || new Date()
                                )
                              }
                            >
                              {hour}
                            </Button>
                          ))}
                      </div>
                      {/* <ScrollBar orientation="horizontal" /> */}
                    </ScrollArea>
                    <ScrollArea className="h-[300px]">
                      <div className="flex p-2 sm:flex-col">
                        {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                          <Button
                            key={minute}
                            size="icon"
                            className={cn(
                              "aspect-square shrink-0 text-[#020817] hover:bg-gray-200 hover:text-[#020817]",
                              field.value && field.value.getMinutes() === minute
                                ? "bg-[#020817] text-white"
                                : "bg-transparent"
                            )}
                            onClick={() =>
                              handleTimeChange(
                                "minute",
                                minute.toString(),
                                field.onChange,
                                field.value || new Date()
                              )
                            }
                          >
                            {minute.toString().padStart(2, "0")}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                    <ScrollArea className="h-[300px]">
                      <div className="flex p-2 sm:flex-col">
                        {["AM", "PM"].map((ampm) => (
                          <Button
                            key={ampm}
                            size="icon"
                            className={cn(
                              "aspect-square shrink-0 text-[#020817] hover:bg-gray-200 hover:text-[#020817]",
                              field.value &&
                                ((ampm === "AM" && field.value.getHours() < 12) ||
                                  (ampm === "PM" && field.value.getHours() >= 12))
                                ? "bg-[#020817] text-white"
                                : "bg-transparent"
                            )}
                            onClick={() =>
                              handleTimeChange(
                                "ampm",
                                ampm,
                                field.onChange,
                                field.value || new Date()
                              )
                            }
                          >
                            {ampm}
                          </Button>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          {error && <FormMessage>{error}</FormMessage>}
        </FormItem>
      )}
    />
  );
};

export default DateTimePicker;
