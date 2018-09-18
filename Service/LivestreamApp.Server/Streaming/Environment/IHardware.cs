﻿using System.Collections.Generic;

namespace LivestreamApp.Server.Streaming.Environment
{
    public interface IHardware
    {
        List<AudioDevice> GetAudioDevices();
    }
}